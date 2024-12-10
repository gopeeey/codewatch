--up
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS codewatch_pg_issues (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stack TEXT NOT NULL,
    "totalOccurrences" INTEGER NOT NULL DEFAULT 0,
    "lastOccurrenceTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastOccurrenceMessage" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP NOT NULL,
    archived BOOLEAN DEFAULT FALSE NOT NULL,
    unhandled BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT FALSE,
    "isLog" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS codewatch_pg_issues_name_idx ON codewatch_pg_issues USING gist ("name" gist_trgm_ops(siglen=256));
CREATE INDEX IF NOT EXISTS codewatch_pg_issues_created_at_idx ON codewatch_pg_issues USING brin ("createdAt");
CREATE TABLE IF NOT EXISTS codewatch_pg_occurrences (
    id BIGSERIAL PRIMARY KEY,
    "issueId" INTEGER NOT NULL,
    message TEXT DEFAULT '',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stdoutLogs" JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
    "stderrLogs" JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
    "extraData" JSONB,
    "systemInfo" JSONB,
    "context" TEXT[][],
    FOREIGN KEY("issueId") REFERENCES codewatch_pg_issues("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS codewatch_pg_occurrences_issueid_idx ON codewatch_pg_occurrences ("issueId");
-- Not using BRIN for this next one because there's no guarantee that the order of the createdAt 
-- will follow the order of the records on the table.
CREATE INDEX IF NOT EXISTS codewatch_pg_occurrences_created_at_idx ON codewatch_pg_occurrences(timestamp);

--down
DROP INDEX IF EXISTS codewatch_pg_occurrences_issueid_idx;
DROP TABLE IF EXISTS codewatch_pg_occurrences;
DROP INDEX IF EXISTS codewatch_pg_issues_created_at_idx;
DROP INDEX IF EXISTS codewatch_pg_issues_name_idx;
DROP TABLE IF EXISTS codewatch_pg_issues;
DROP EXTENSION IF EXISTS pg_trgm;