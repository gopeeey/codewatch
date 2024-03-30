export interface ErrorData {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurences: number;
  lastOccurenceTimestamp: string;
  muted: boolean;
}

export interface Occurence {
  errorId: ErrorData["id"];
  message: string;
  timestamp: string;
  stdoutLogs: [number, string][];
  stderrLogs: [number, string][];
}

export interface Storage {
  createError: (data: Omit<ErrorData, "id">) => Promise<ErrorData["id"]>;
  addOccurence: (data: Occurence) => Promise<void>;
  updateLastOccurenceOnError: (
    data: Pick<Occurence, "errorId" | "timestamp">
  ) => Promise<void>;
  findErrorIdByFingerprint: (
    fingerprint: ErrorData["fingerprint"]
  ) => Promise<ErrorData["id"] | null>;
  close: () => Promise<void>;
}
