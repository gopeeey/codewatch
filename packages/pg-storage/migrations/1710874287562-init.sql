--up
CREATE TABLE IF NOT EXISTS codewatch_pg_errors (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    stack VARCHAR NOT NULL,
    "totalOccurences" INTEGER NOT NULL DEFAULT 0,
    "lastOccurenceTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    muted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS codewatch_pg_occurences (
    id SERIAL PRIMARY KEY,
    "errorId" INTEGER NOT NULL,
    message VARCHAR DEFAULT '',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("errorId") REFERENCES codewatch_pg_errors("id") ON DELETE CASCADE ON UPDATE CASCADE
);

--down
DROP TABLE IF EXISTS codewatch_pg_occurences;
DROP TABLE IF EXISTS codewatch_pg_errors;