import { Issue, Storage } from "@codewatch/types";
import fs from "fs";
import path from "path";
import { Pool, PoolConfig, types as pgTypes } from "pg";
import SQL from "sql-template-strings";
import { DbIssue } from "./types";

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
    await this._pool.query(SQL`
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
    const { rows } = await this._pool.query<Migration>(`
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
    await this._pool.query(SQL`
      INSERT INTO codewatch_pg_migrations (name) VALUES (${name})
      ON CONFLICT DO NOTHING;
    `);
  };

  private _removeMigrationRecord = async (name: string) => {
    await this._pool.query(SQL`
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
      await this._pool.query(contents[0]);
    } else {
      await this._pool.query(contents[1]);
    }
  };

  private _standardizeIssues = (issues: DbIssue[]): Issue[] => {
    return issues.map((issue) => ({
      ...issue,
      id: issue.id.toString(),
    }));
  };

  addOccurrence: Storage["addOccurrence"] = async (data) => {
    await this._pool.query(SQL`
      INSERT INTO codewatch_pg_occurrences (
        "issueId", 
        message, 
        timestamp,
        "stdoutLogs",
        "stderrLogs"
      )
      VALUES (
        ${data.issueId}, 
        ${data.message}, 
        ${data.timestamp},
        ${data.stdoutLogs},
        ${data.stderrLogs}
      );
    `);
  };

  createIssue: Storage["createIssue"] = async (data) => {
    const query = SQL`INSERT INTO codewatch_pg_issues (
      fingerprint, 
      name, 
      stack, 
      "totalOccurrences", 
      "lastOccurrenceTimestamp",
      "lastOccurrenceMessage",
      "muted",
      "unhandled",
      "createdAt"
      )
      VALUES (
        ${data.fingerprint}, 
        ${data.name}, 
        ${data.stack}, 
        ${data.totalOccurrences},
        ${data.lastOccurrenceTimestamp},
        ${data.lastOccurrenceMessage},
        ${data.muted},
        ${data.unhandled},
        ${data.createdAt}
      ) RETURNING id;`;
    const { rows } = await this._pool.query<{ id: DbIssue["id"] }>(query);
    return rows[0].id.toString();
  };

  findIssueIdByFingerprint: Storage["findIssueIdByFingerprint"] = async (
    fingerprint
  ) => {
    const query = SQL`SELECT id FROM codewatch_pg_issues WHERE fingerprint = ${fingerprint};`;
    const { rows } = await this._pool.query<{ id: DbIssue["id"] }>(query);
    return rows[0]?.id.toString() || null;
  };

  updateLastOccurrenceOnIssue: Storage["updateLastOccurrenceOnIssue"] = async (
    data
  ) => {
    await this._pool.query(SQL`
      UPDATE codewatch_pg_issues SET 
      "lastOccurrenceTimestamp" = ${data.timestamp},
      "lastOccurrenceMessage" = ${data.message},
      "totalOccurrences" = "totalOccurrences" + 1
      WHERE id = ${data.issueId};
    `);
  };

  getPaginatedIssues: Storage["getPaginatedIssues"] = async (filters) => {
    const offset = (filters.page - 1) * filters.perPage;
    const query = SQL`
    SELECT * FROM codewatch_pg_issues WHERE resolved = ${filters.resolved}`;

    if (filters.searchString.length) {
      query.append(SQL` AND name ILIKE ${"%" + filters.searchString + "%"} `);
    }

    if (filters.startDate) {
      query.append(SQL` AND "createdAt" >= ${new Date(filters.startDate)} `);
    }

    if (filters.endDate) {
      query.append(SQL` AND "createdAt" <= ${new Date(filters.endDate)} `);
    }

    query.append(
      SQL` ORDER BY "createdAt" DESC OFFSET ${offset} LIMIT ${filters.perPage};`
    );

    const { rows } = await this._pool.query<DbIssue>(query);
    return this._standardizeIssues(rows);
  };

  getIssuesTotal: Storage["getIssuesTotal"] = async (filters) => {
    const query = SQL`
    SELECT COUNT(*) FROM codewatch_pg_issues WHERE resolved = ${filters.resolved}`;

    if (filters.searchString.length) {
      query.append(SQL` AND name ILIKE ${"%" + filters.searchString + "%"} `);
    }

    if (filters.startDate) {
      query.append(SQL` AND "createdAt" >= ${new Date(filters.startDate)} `);
    }

    if (filters.endDate) {
      query.append(SQL` AND "createdAt" <= ${new Date(filters.endDate)} `);
    }
    const { rows } = await this._pool.query<{ count: number }>(query);
    return rows[0].count;
  };

  deleteIssues: Storage["deleteIssues"] = async (issueIds) => {
    await this._pool.query(SQL`
      DELETE FROM codewatch_pg_issues WHERE id = ANY(${issueIds});
    `);
  };

  resolveIssues: Storage["resolveIssues"] = async (issueIds) => {
    await this._pool.query(SQL`
      UPDATE codewatch_pg_issues SET resolved = true WHERE id = ANY(${issueIds});
    `);
  };
}
