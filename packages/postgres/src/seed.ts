import { Issue } from "codewatch-core/dist/types";
import { config } from "dotenv";
import moment from "moment";
import { nanoid } from "nanoid";
import path from "path";
import { Pool, types as pgTypes } from "pg";
import { generate } from "random-words";
import SQL from "sql-template-strings";
import { DbOccurrence } from "./types";
import { interpolate, randNumBtw, randomBoolean } from "./utils";

pgTypes.setTypeParser(pgTypes.builtins.INT8, (num) => parseInt(num, 10));

config({ path: path.join(__dirname, "../.env") });

type SeedIssueData = Omit<Issue, "id">;
type SeedOccurrenceData = Omit<DbOccurrence, "id">;

async function seedIssues(pool: Pool, amount: number) {
  console.log("Seeding issues...");
  const query = SQL`--sql
  INSERT INTO codewatch_pg_issues ( 
    "fingerprint", 
    "name", 
    "stack", 
    "totalOccurrences", 
    "lastOccurrenceTimestamp", 
    "lastOccurrenceMessage", 
    "archived", 
    "unhandled", 
    "createdAt", 
    "resolved", 
    "isLog"
    ) VALUES `;

  let count = 0;
  const maxDate = moment().subtract(1, "year");
  const minDate = moment().subtract(3, "years");

  while (count < amount) {
    const currentEpoch = Math.floor(
      interpolate(
        count,
        0,
        amount,
        minDate.toDate().getTime(),
        maxDate.toDate().getTime()
      )
    );
    const timestamp = new Date(currentEpoch).toISOString();
    const isLog = randomBoolean();

    const data: SeedIssueData = {
      fingerprint: nanoid(30),
      name: generate({ exactly: randNumBtw(1, 10), join: " " }),
      stack: generate({ exactly: randNumBtw(1, 20), join: "\n" }),
      totalOccurrences: Math.floor(randNumBtw(2, 2000)),
      lastOccurrenceTimestamp: timestamp,
      lastOccurrenceMessage: generate({
        exactly: randNumBtw(1, 30),
        join: " ",
      }),
      archived: randomBoolean(),
      unhandled: isLog ? false : randomBoolean(),
      createdAt: timestamp,
      resolved: randomBoolean(),
      isLog,
    };

    query.append(
      SQL`(${data.fingerprint}, ${data.name}, ${data.stack}, ${data.totalOccurrences}, ${data.lastOccurrenceTimestamp}, ${data.lastOccurrenceMessage}, ${data.archived}, ${data.unhandled}, ${data.createdAt}, ${data.resolved}, ${data.isLog})`
    );
    if (count === amount - 1) {
      query.append(";");
    } else {
      query.append(", ");
    }

    count++;
  }

  await pool.query(query);
}

async function seedOccurrences(pool: Pool) {
  console.log("Seeding occurrences...");

  const query = SQL`--sql
    WITH tb AS (
      SELECT
        COUNT(*) FILTER (WHERE o."issueId" IS NOT NULL) AS "existingOccurrences",
        i."totalOccurrences",
        i."id" AS "issueId",
        i."lastOccurrenceTimestamp",
        i."createdAt"
      FROM codewatch_pg_issues i
      LEFT JOIN codewatch_pg_occurrences o ON o."issueId" = i.id
      GROUP BY i."id", i."totalOccurrences", i."lastOccurrenceTimestamp", i."createdAt"
    )
    SELECT * FROM tb 
    WHERE (tb."totalOccurrences" - tb."existingOccurrences") > 0
    ORDER BY tb."lastOccurrenceTimestamp";
  `;

  const { rows } = await pool.query<{
    existingOccurrences: number;
    totalOccurrences: number;
    issueId: number;
    lastOccurrenceTimestamp: string;
    createdAt: string;
  }>(query);

  let timestamp = moment(rows[0].lastOccurrenceTimestamp);
  const lastTimestamp = moment(
    rows[rows.length - 1].lastOccurrenceTimestamp
  ).add(rows[rows.length - 1].totalOccurrences, "seconds");

  let totalExpected = 0;
  let totalExisting = 0;

  rows.forEach((row) => {
    totalExpected += row.totalOccurrences;
    totalExisting += row.existingOccurrences;
  });

  let logTime = moment();
  let logInterval = 5;

  while (timestamp.isSameOrBefore(lastTimestamp)) {
    const timeSinceLastLog = moment().diff(logTime, "seconds");
    if (timeSinceLastLog && timeSinceLastLog % logInterval === 0) {
      const progress = totalExisting / totalExpected;
      console.clear();
      console.log(`Progress: ${(progress * 100).toFixed(2)}%`);
      logTime = moment();
    }

    const q = SQL`--sql
      INSERT INTO codewatch_pg_occurrences (
        "issueId",
        message,
        timestamp,
        "stdoutLogs",
        "stderrLogs"
      ) VALUES 
    `;

    const q2 = SQL`--sql
      UPDATE codewatch_pg_issues
      SET "lastOccurrenceTimestamp" = ${timestamp.toISOString()}
      WHERE id = ANY(ARRAY[
    `;
    let run = false;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.existingOccurrences >= row.totalOccurrences) continue;
      if (moment(row.lastOccurrenceTimestamp).isAfter(timestamp)) break;

      const occurrenceData: SeedOccurrenceData = {
        issueId: row.issueId,
        message: generate({
          exactly: randNumBtw(1, 30),
          join: " ",
        }),
        timestamp: timestamp.toISOString(),
        stdoutLogs: [],
        stderrLogs: [],
      };

      if (run) {
        q.append(", ");
        q2.append(", ");
      }

      q.append(
        SQL`(
          ${occurrenceData.issueId}, 
          ${occurrenceData.message}, 
          ${occurrenceData.timestamp},
          ${occurrenceData.stdoutLogs}, 
          ${occurrenceData.stderrLogs}
          )`
      );

      q2.append(`${occurrenceData.issueId}`);

      if (!run) run = true;

      rows[i].lastOccurrenceTimestamp = timestamp.toISOString();
      rows[i].existingOccurrences++;
      totalExisting++;
    }
    q.append(";");
    q2.append("]);");

    if (run) {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        await client.query(q);
        await client.query(q2);
        await client.query("COMMIT");
        client.release();
      } catch (err) {
        await client.query("ROLLBACK");
        client.release();
        throw err;
      }

      timestamp.add(1, "second");
    } else {
      timestamp.add(60, "seconds");
    }
  }
}

async function main() {
  const pool = new Pool({
    user: process.env.SEED_POSTGRES_DB_USERNAME,
    host: process.env.SEED_POSTGRES_DB_HOST,
    database: process.env.SEED_POSTGRES_DB_NAME,
    password: process.env.SEED_POSTGRES_DB_PASSWORD,
    port: Number(process.env.SEED_POSTGRES_DB_PORT),
  });

  // await seedIssues(pool, 2000);

  await seedOccurrences(pool);
}

main();
