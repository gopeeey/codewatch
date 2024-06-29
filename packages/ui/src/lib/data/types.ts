import { Occurrence, StdChannelLog } from "@codewatch/types";

export interface StdChannelLogWithId extends StdChannelLog {
  id: string;
}

export interface OccurrenceWithId extends Occurrence {
  id: string;
  stderrLogs: StdChannelLogWithId[];
  stdoutLogs: StdChannelLogWithId[];
}
