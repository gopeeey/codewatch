--up
CREATE TABLE IF NOT EXISTS codewatch_pg_issues (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stack TEXT NOT NULL,
    "totalOccurrences" INTEGER NOT NULL DEFAULT 0,
    "lastOccurrenceTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastOccurrenceMessage" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    muted BOOLEAN DEFAULT FALSE NOT NULL,
    unhandled BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS codewatch_pg_occurrences (
    id SERIAL PRIMARY KEY,
    "issueId" INTEGER NOT NULL,
    message TEXT DEFAULT '',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stdoutLogs" JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
    "stderrLogs" JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
    FOREIGN KEY("issueId") REFERENCES codewatch_pg_issues("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS codewatch_pg_occurrences_issueid_idx ON codewatch_pg_occurrences ("issueId");

--down
DROP INDEX IF EXISTS codewatch_pg_occurrences_issueid_idx;
DROP TABLE IF EXISTS codewatch_pg_occurrences;
DROP TABLE IF EXISTS codewatch_pg_issues;