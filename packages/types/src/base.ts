export interface Issue {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurrences: number;
  lastOccurrenceTimestamp: string;
  lastOccurrenceMessage: string;
  archived: boolean;
  unhandled: boolean;
  createdAt: string;
  resolved: boolean;
  isLog: boolean;
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
type DailyOccurrenceCount = { date: string; count: number };

export interface StatsData {
  totalIssues: number;
  totalOccurrences: number;
  dailyOccurrenceCount: DailyOccurrenceCount[];
  dailyUnhandledOccurrenceCount: DailyOccurrenceCount[];
  totalUnhandledOccurrences: number;
  totalManuallyCapturedOccurrences: number;
  totalLoggedData: number;
  mostRecurringIssues: Issue[];
}
