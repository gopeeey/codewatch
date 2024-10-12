import {
  Issue,
  Occurrence,
  StatsData,
  Storage,
  Transaction,
} from "@codewatch/types";
import fs from "fs";
import path from "path";
import { Pool, PoolClient, PoolConfig, types as pgTypes } from "pg";
import SQL, { SQLStatement } from "sql-template-strings";
import { DbIssue } from "./types";
import { getTimezoneString } from "./utils";

pgTypes.setTypeParser(pgTypes.builtins.TIMESTAMPTZ, (val) =>
  new Date(val).toISOString()
);
pgTypes.setTypeParser(pgTypes.builtins.INT8, (num) => parseInt(num, 10));

type Migration = {
  id: number;
  name: string;
  applied_on: string;
};

export class CodewatchPgStorage implements Storage {
  private _pool;
  ready = false;
  migrationsBasePath = path.join(__dirname, "../migrations");

  constructor(config: PoolConfig) {
    if (!config.max) config.max = 2;
    this._pool = new Pool(config);
  }

  init: Storage["init"] = async () => {
    // Create migrations table
    await this._query(SQL`
      CREATE TABLE IF NOT EXISTS codewatch_pg_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this._runMigrations("up");
    this.ready = true;
  };

  close: Storage["close"] = async () => {
    await this._pool.end();
    this.ready = false;
  };

  private _query = async <T extends object>(
    query: SQLStatement | string,
    transaction?: Transaction
  ) => {
    if (transaction) {
      return await (transaction as PgTransaction)._client.query<T>(query);
    } else {
      return await this._pool.query<T>(query);
    }
  };

  private _runMigrations = async (direction: "up" | "down") => {
    let filenames = await new Promise<string[]>((resolve, reject) => {
      fs.readdir(this.migrationsBasePath, (err, files) => {
        if (err) return reject(err);
        resolve(files);
      });
    });
    filenames = filenames
      .map((file) => file.split(".sql")[0])
      .sort((a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]));

    // Get applied migrations
    const { rows } = await this._query<Migration>(`
      SELECT * FROM codewatch_pg_migrations ORDER BY applied_on DESC;
    `);
    const appliedMigrations = rows.map(({ name }) => name);
    let lastAppliedMigrationDate = 0;
    if (rows.length) {
      lastAppliedMigrationDate = new Date(
        rows[rows.length - 1].applied_on
      ).getTime();
    }

    if (direction === "up") {
      // Apply migrations
      for (const file of filenames) {
        if (parseInt(file.split("-")[0]) <= lastAppliedMigrationDate) continue;
        await this._runMigrationFile(file, direction);
        await this._addMigrationRecord(file);
      }
    } else {
      // Undo migrations
      for (const migration of appliedMigrations) {
        if (!filenames.includes(migration)) continue;
        await this._runMigrationFile(migration, direction);
        await this._removeMigrationRecord(migration);
      }
    }
  };

  private _addMigrationRecord = async (name: string) => {
    await this._query(SQL`
      INSERT INTO codewatch_pg_migrations (name) VALUES (${name})
      ON CONFLICT DO NOTHING;
    `);
  };

  private _removeMigrationRecord = async (name: string) => {
    await this._query(SQL`
      DELETE FROM codewatch_pg_migrations WHERE name = ${name};
    `);
  };

  private _runMigrationFile = async (
    filename: string,
    direction: "up" | "down"
  ) => {
    const file = await new Promise<string>((resolve, reject) => {
      fs.readFile(
        path.join(this.migrationsBasePath, filename + ".sql"),
        "utf-8",
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
    const contents = file.split("--down");

    if (direction === "up") {
      await this._query(contents[0]);
    } else {
      await this._query(contents[1]);
    }
  };

  private _standardizeIssues = (issues: DbIssue[]): Issue[] => {
    return issues.map((issue) => ({
      ...issue,
      id: issue.id.toString(),
    }));
  };

  createTransaction: Storage["createTransaction"] = async () => {
    return await PgTransaction.start(this._pool);
  };

  runInTransaction: Storage["runInTransaction"] = async (fn) => {
    const transaction = await this.createTransaction();
    try {
      const val = await fn(transaction);
      await transaction.commit();
      return val;
    } catch (err) {
      await transaction.rollback();
      throw err;
    } finally {
      await transaction.end();
    }
  };

  addOccurrence: Storage["addOccurrence"] = async (data, transaction) => {
    await this._query(
      SQL`
      INSERT INTO codewatch_pg_occurrences (
        "issueId", 
        message, 
        timestamp,
        "stdoutLogs",
        "stderrLogs",
        "extraData",
        "systemInfo"
      )
      VALUES (
        ${data.issueId}, 
        ${data.message}, 
        ${data.timestamp},
        ${data.stdoutLogs},
        ${data.stderrLogs},
        ${data.extraData},
        ${data.systemInfo}
      );
    `,
      transaction
    );
  };

  createIssue: Storage["createIssue"] = async (data, transaction) => {
    const query = SQL`INSERT INTO codewatch_pg_issues (
      fingerprint, 
      name, 
      stack, 
      "totalOccurrences", 
      "lastOccurrenceTimestamp",
      "lastOccurrenceMessage",
      "archived",
      "unhandled",
      "createdAt",
      "isLog"
      )
      VALUES (
        ${data.fingerprint}, 
        ${data.name}, 
        ${data.stack}, 
        ${data.totalOccurrences},
        ${data.lastOccurrenceTimestamp},
        ${data.lastOccurrenceMessage},
        ${data.archived},
        ${data.unhandled},
        ${data.createdAt},
        ${data.isLog}
      ) RETURNING id;`;
    const { rows } = await this._query<{ id: DbIssue["id"] }>(
      query,
      transaction
    );
    return rows[0].id.toString();
  };

  findIssueIdxArchiveStatusByFingerprint: Storage["findIssueIdxArchiveStatusByFingerprint"] =
    async (fingerprint, transaction) => {
      const query = SQL`SELECT id, archived FROM codewatch_pg_issues WHERE fingerprint = ${fingerprint};`;
      const { rows } = await this._query<Pick<DbIssue, "id" | "archived">>(
        query,
        transaction
      );
      if (!rows.length) return null;
      return {
        id: rows[0].id.toString(),
        archived: rows[0].archived,
      };
    };

  updateLastOccurrenceOnIssue: Storage["updateLastOccurrenceOnIssue"] = async (
    data,
    transaction
  ) => {
    await this._query(
      SQL`
      UPDATE codewatch_pg_issues SET 
      "lastOccurrenceTimestamp" = ${data.timestamp},
      "lastOccurrenceMessage" = ${data.message},
      "totalOccurrences" = "totalOccurrences" + 1,
      "stack" = ${data.stack},
      "resolved" = ${data.resolved}
      WHERE id = ${data.issueId};
    `,
      transaction
    );
  };

  getPaginatedIssues: Storage["getPaginatedIssues"] = async (filters) => {
    const offset = (filters.page - 1) * filters.perPage;
    const query = SQL`
    SELECT * FROM codewatch_pg_issues WHERE `;

    switch (filters.tab) {
      case "archived":
        query.append(SQL` archived = true `);
        break;
      case "resolved":
        query.append(SQL` archived = false AND resolved = true `);
        break;
      case "unresolved":
        query.append(SQL` archived = false AND resolved = false `);
        break;
      default:
        throw new Error("Invalid tab");
    }

    if (filters.searchString.length) {
      query.append(SQL` AND ${filters.searchString} % name `);
    }

    if (filters.startDate) {
      query.append(SQL` AND "createdAt" >= ${new Date(filters.startDate)} `);
    }

    if (filters.endDate) {
      query.append(SQL` AND "createdAt" <= ${new Date(filters.endDate)} `);
    }

    // Sorting
    let sortColumns: string[] = [];

    if (filters.sort !== "relevance") {
      switch (filters.sort) {
        case "created-at":
          sortColumns = [
            "createdAt",
            "lastOccurrenceTimestamp",
            "totalOccurrences",
          ];
          break;
        case "last-seen":
          sortColumns = [
            "lastOccurrenceTimestamp",
            "createdAt",
            "totalOccurrences",
          ];
          break;
        case "total-occurrences":
          sortColumns = [
            "totalOccurrences",
            "createdAt",
            "lastOccurrenceTimestamp",
          ];
          break;
        default:
          throw new Error("Invalid sort parameter");
      }
    }

    query.append(SQL` ORDER BY`);

    let mainSortColumn = SQL``;
    if (filters.sort === "relevance") {
      mainSortColumn = SQL` similarity(${filters.searchString}, "name")`;
    } else {
      const col = sortColumns.shift() as string;
      mainSortColumn = SQL` `.append(`"${col}"`);
    }
    mainSortColumn.append(filters.order === "asc" ? SQL` ASC` : SQL` DESC`);
    query.append(mainSortColumn);
    const otherSortColumns = SQL``;
    sortColumns.forEach((col) => {
      otherSortColumns
        .append(SQL`, `)
        .append(`"${col}" ${filters.order === "asc" ? "ASC" : "DESC"}`);
    });

    // Pagination
    query.append(SQL` OFFSET ${offset} LIMIT ${filters.perPage};`);

    const { rows } = await this._query<DbIssue>(query);
    return this._standardizeIssues(rows);
  };

  getIssuesTotal: Storage["getIssuesTotal"] = async (filters) => {
    const query = SQL`
    SELECT COUNT(id) FROM codewatch_pg_issues WHERE `;

    switch (filters.tab) {
      case "archived":
        query.append(SQL` archived = true `);
        break;
      case "resolved":
        query.append(SQL` archived = false AND resolved = true `);
        break;
      case "unresolved":
        query.append(SQL` archived = false AND resolved = false `);
        break;
      default:
        throw new Error("Invalid tab");
    }

    if (filters.searchString.length) {
      query.append(SQL` AND name ILIKE ${"%" + filters.searchString + "%"} `);
    }

    if (filters.startDate) {
      query.append(SQL` AND "createdAt" >= ${new Date(filters.startDate)} `);
    }

    if (filters.endDate) {
      query.append(SQL` AND "createdAt" <= ${new Date(filters.endDate)} `);
    }
    const { rows } = await this._query<{ count: number }>(query);
    return rows[0].count;
  };

  deleteIssues: Storage["deleteIssues"] = async (issueIds) => {
    await this._query(SQL`
      DELETE FROM codewatch_pg_issues WHERE id = ANY(${issueIds});
    `);
  };

  resolveIssues: Storage["resolveIssues"] = async (issueIds) => {
    await this._query(SQL`
      UPDATE codewatch_pg_issues SET resolved = true WHERE id = ANY(${issueIds});
    `);
  };

  unresolveIssues: Storage["resolveIssues"] = async (issueIds) => {
    await this._query(SQL`
      UPDATE codewatch_pg_issues SET resolved = false WHERE id = ANY(${issueIds});
    `);
  };

  findIssueById: Storage["findIssueById"] = async (id, transaction) => {
    const { rows } = await this._query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE id = ${Number(id)};`,
      transaction
    );
    if (!rows.length) return null;
    return this._standardizeIssues(rows)[0];
  };

  getPaginatedOccurrences: Storage["getPaginatedOccurrences"] = async (
    filters
  ) => {
    const offset = (filters.page - 1) * filters.perPage;
    const query = SQL`
    SELECT * FROM codewatch_pg_occurrences 
    WHERE "issueId" = ${Number(filters.issueId)}
    AND timestamp >= ${new Date(filters.startDate)}
    AND timestamp <= ${new Date(filters.endDate)}
    ORDER BY timestamp DESC OFFSET ${offset} LIMIT ${filters.perPage};
    `;

    const { rows } = await this._query<Occurrence>(query);
    return rows;
  };

  archiveIssues: Storage["archiveIssues"] = async (issueIds) => {
    await this._query(SQL`
      UPDATE codewatch_pg_issues SET archived = true WHERE id = ANY(${issueIds});
    `);
  };

  unarchiveIssues: Storage["unarchiveIssues"] = async (issueIds) => {
    await this._query(SQL`
      UPDATE codewatch_pg_issues SET archived = false WHERE id = ANY(${issueIds});
    `);
  };

  getStatsData: Storage["getStatsData"] = async (filters) => {
    const timezone = getTimezoneString(filters.timezoneOffset);
    console.log("\n\n\nTHE TIMEZONE", timezone, filters.timezoneOffset);
    const query = SQL`--sql
    WITH tab AS (
      SELECT
        o.id,
        o."issueId",
        o."timestamp" AS "occurrenceTimestamp",
        i."unhandled",
		    i."isLog"
      FROM codewatch_pg_occurrences AS o
      INNER JOIN codewatch_pg_issues AS i ON o."issueId" = i."id"
      WHERE o."timestamp" >= ${new Date(filters.startDate)}
      AND o."timestamp" <= ${new Date(filters.endDate)}
    )

    SELECT
`;

    const dailyOccurrenceQuery = `
    COALESCE(
        (
          SELECT
          jsonb_agg(
            jsonb_build_object(
            'count', tb.c,
            'date', tb.date
            )
            ORDER BY tb.date
          )
          FROM (
            SELECT
              COUNT(*) AS c,
              date(tab."occurrenceTimestamp" AT TIME ZONE '${timezone}') AS "date"
            FROM tab
            GROUP BY date(tab."occurrenceTimestamp" AT TIME ZONE '${timezone}')
          ) tb
        ), 
        '[]'
      ) AS "dailyOccurrenceCount",

      COALESCE(
        (
          SELECT
            jsonb_agg(
              jsonb_build_object(
                'count', tb.c,
                'date', tb.date
              )
              ORDER BY tb.date
            )
          FROM (
            SELECT
              COUNT(*) AS c,
              date(tab."occurrenceTimestamp" AT TIME ZONE '${timezone}') AS "date"
            FROM tab
            WHERE tab."unhandled" = true
            GROUP BY date(tab."occurrenceTimestamp" AT TIME ZONE '${timezone}')
          ) tb
        ),
        '[]'
      ) AS "dailyUnhandledOccurrenceCount",
`;

    const otherStatsQuery = SQL`--sql
      (
        SELECT
          COUNT(*)
        FROM (
          SELECT tab."issueId"
          FROM tab
          GROUP BY tab."issueId"
        )
      ) AS "totalIssues",

      (
        SELECT
          COUNT(*)
        FROM tab
        WHERE tab."isLog" = true
      ) AS "totalLoggedData",

      (
        SELECT
          COUNT(*)
        FROM tab
        WHERE tab."unhandled" = true
      ) AS "totalUnhandledOccurrences",

      (
        SELECT
          COUNT(*)
        FROM tab
        WHERE tab."unhandled" = false
        AND tab."isLog" = false
      ) AS "totalManuallyCapturedOccurrences",

      (
        SELECT
          COUNT(*)
        FROM tab
      ) AS "totalOccurrences",

      COALESCE(
        (
          SELECT 
            jsonb_agg(c ORDER BY tbb.occurrences DESC, tbb."lastOccurrenceTimestamp" DESC)
          FROM (
            SELECT
              COUNT(*) AS occurrences,
              tab."issueId",
              MAX(EXTRACT(epoch from tab."occurrenceTimestamp")) AS "lastOccurrenceTimestamp"
            FROM tab
            GROUP BY tab."issueId"
            ORDER BY occurrences DESC, "lastOccurrenceTimestamp" DESC LIMIT 5
          ) tbb
          INNER JOIN codewatch_pg_issues c ON tbb."issueId" = c."id"
        ), 
        '[]'
      ) AS "mostRecurringIssues"
    ;
    `;

    query.append(dailyOccurrenceQuery).append(otherStatsQuery);

    const { rows } = await this._query<StatsData>(query);

    return rows[0];
  };
}

export class PgTransaction implements Transaction {
  _client: PoolClient;

  private constructor(client: PoolClient) {
    this._client = client;
  }

  static async start(pool: Pool) {
    const client = await pool.connect();
    await client.query("BEGIN");
    return new PgTransaction(client);
  }

  async commit() {
    await this._client.query("COMMIT");
  }

  async rollback() {
    await this._client.query("ROLLBACK");
  }

  async end() {
    this._client.release();
  }

  async commitAndEnd() {
    await this._client.query("COMMIT");
    this._client.release();
  }

  async rollbackAndEnd() {
    await this._client.query("ROLLBACK");
    this._client.release();
  }
}
