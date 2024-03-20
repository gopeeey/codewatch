--up
CREATE TABLE IF NOT EXISTS codewatch_pg_errors (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR UNIQUE NOT NULL,
    "totalOccurences" INTEGER NOT NULL DEFAULT 0,
    "lastOccurenceTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    muted BOOLEAN DEFAULT FALSE NOT NULL
);

--down
DROP TABLE IF EXISTS codewatch_pg_errors;