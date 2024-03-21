export interface ErrorData {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurences: number;
  lastOccurenceTimestamp: string;
  muted: boolean;
}

export type CreateErrorData = Pick<
  ErrorData,
  "fingerprint" | "name" | "stack" | "lastOccurenceTimestamp"
>;

export interface Occurence {
  errorId: ErrorData["id"];
  message: string;
  timestamp: string;
}

export interface Storage {
  createError: (data: CreateErrorData) => Promise<ErrorData["id"]>;
  addOccurence: (data: Occurence) => Promise<void>;
  updateLastOccurenceOnError: (data: Occurence) => Promise<void>;
  findErrorIdByFingerprint: (
    fingerprint: ErrorData["fingerprint"]
  ) => Promise<ErrorData["id"] | null>;
  init: () => Promise<void>;
  close: () => Promise<void>;
  ready: boolean;
}
