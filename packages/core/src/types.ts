export interface ErrorData {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurrences: number;
  lastOccurrenceTimestamp: string;
  lastOccurrenceMessage: string;
  muted: boolean;
  unhandled: boolean;
  createdAt: string;
}

export interface Occurrence {
  errorId: ErrorData["id"];
  message: string;
  timestamp: string;
  stdoutLogs: [number, string][];
  stderrLogs: [number, string][];
}

export interface Storage {
  createError: (data: Omit<ErrorData, "id">) => Promise<ErrorData["id"]>;
  addOccurrence: (data: Occurrence) => Promise<void>;
  updateLastOccurrenceOnError: (
    data: Pick<Occurrence, "errorId" | "timestamp">
  ) => Promise<void>;
  findErrorIdByFingerprint: (
    fingerprint: ErrorData["fingerprint"]
  ) => Promise<ErrorData["id"] | null>;
  close: () => Promise<void>;
}
