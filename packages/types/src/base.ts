export interface Issue {
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
  resolved: boolean;
}

export type StdChannelLog = { timestamp: number; message: string };

export type SystemInfo = {
  deviceMemory: number;
  freeMemory: number;
  appMemoryUsage: number;
  deviceUptime: number;
  appUptime: number;
};

export interface Occurrence {
  issueId: Issue["id"];
  message: string;
  timestamp: string;
  stdoutLogs: StdChannelLog[];
  stderrLogs: StdChannelLog[];
  extraData?: Record<any, any>;
  systemInfo?: SystemInfo;
}
