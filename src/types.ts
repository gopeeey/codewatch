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
}

export interface Storage {
  createError: (data: Omit<ErrorData, "id">) => Promise<ErrorData["id"]>;
  addOccurence: (data: Occurence) => Promise<void>;
  updateLastOccurenceOnError: (data: Occurence) => Promise<void>;
  findErrorIdByFingerprint: (
    fingerprint: ErrorData["fingerprint"]
  ) => Promise<ErrorData["id"] | null>;
}
