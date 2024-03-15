export interface ErrorData {
  id: string;
  fingerPrint: string;
  stack: string;
  name: string;
  totalOccurences: number;
  lastOccurenceTimestamp: string;
}

export interface Occurence {
  errorId: ErrorData["id"];
  message: string;
  timestamp: string;
}

export interface Storage {
  save: (data: ErrorData) => Promise<void>;
  getErrorIdByFingerPrint: (
    fingerPrint: ErrorData["fingerPrint"]
  ) => Promise<ErrorData["id"] | null>;
}
