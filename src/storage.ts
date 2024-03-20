import fs from "fs";
import path from "path";
import { Pool, PoolConfig } from "pg";
import SQL from "sql-template-strings";
import { Storage } from "./types";

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
  };

  close: Storage["close"] = async () => {
    await this._pool.end();
  };

  protected _runMigrations = async (direction: "up" | "down") => {
    let filenames = await new Promise<string[]>((resolve, reject) => {
      fs.readdir(this.migrationsBasePath, (err, files) => {
        if (err) return reject(err);
        resolve(files);
      });
    });
    console.log(filenames);
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

  protected _addMigrationRecord = async (name: string) => {
    await this._pool.query(SQL`
      INSERT INTO codewatch_pg_migrations (name) VALUES (${name})
      ON CONFLICT DO NOTHING;
    `);
  };

  protected _removeMigrationRecord = async (name: string) => {
    await this._pool.query(SQL`
      DELETE FROM codewatch_pg_migrations WHERE name = ${name};
    `);
  };

  protected _runMigrationFile = async (
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

  addOccurence: Storage["addOccurence"] = async (data) => {};

  createError: Storage["createError"] = async (data) => {
    return "";
  };

  findErrorIdByFingerprint: Storage["findErrorIdByFingerprint"] = async (
    fingerprint
  ) => {
    return "";
  };

  updateLastOccurenceOnError: Storage["updateLastOccurenceOnError"] = async (
    data
  ) => {};
}
