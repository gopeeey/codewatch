import { config } from "dotenv";
import { Pool } from "pg";

config();

export const dbSetup = () => {
  // Connect to the database
  const pool = new Pool({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });

  afterEach(async () => {
    // Truncate each table except migrations
  }, 5000);

  afterAll(() => pool.end());

  return pool;
};
