import Levenshtein from "levenshtein";
import {
  CreateIssueData,
  IsoFromNow,
  TestIssueData,
} from "src/tests/storage/types";
import { Issue } from "src/types";

export const createCreateIssueData = (
  timestamp: string,
  overrides?: Partial<Omit<Issue, "id">>
) => {
  const issue: CreateIssueData = {
    fingerprint: "123456789012345678",
    lastOccurrenceTimestamp: timestamp,
    createdAt: timestamp,
    lastOccurrenceMessage: "",
    archived: false,
    totalOccurrences: 1,
    unhandled: false,
    name: "Error 1",
    isLog: false,
    ...overrides,
  };
  return issue;
};

export const fPrintSortFn = (a: string, b: string) => Number(a) - Number(b);

export const getStringDistance = (a: string, b: string) => {
  const lv = new Levenshtein(a, b);
  return lv.distance;
};

export const nameFilter = (
  data: TestIssueData,
  searchString: string,
  defaultName?: boolean
) => {
  if (defaultName) {
    return (
      (data.overrides &&
        data.overrides.name &&
        data.overrides.name
          .toLowerCase()
          .includes(searchString.toLowerCase())) ||
      !data.overrides?.name
    );
  }
  return (
    data.overrides &&
    data.overrides.name &&
    data.overrides.name.toLowerCase().includes(searchString.toLowerCase())
  );
};

export const unresolvedFilter = (data: TestIssueData) => {
  return (
    (data.overrides && !data.overrides.resolved && !data.overrides.archived) ||
    !data.overrides
  );
};

export const resolvedFilter = (data: TestIssueData) => {
  return data.overrides && data.overrides.resolved && !data.overrides.archived;
};

export const archivedFilter = (data: TestIssueData) => {
  return data.overrides && data.overrides.archived;
};

export const withinDateRange = (
  timestamp: string,
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const current = new Date(timestamp).getTime();
  return current >= start && current <= end;
};

export const timeFilter = (
  data: TestIssueData,
  isoFromNow: IsoFromNow,
  startTime?: number,
  endTime?: number
) => {
  if (!startTime && !endTime) return true;
  if (!startTime && endTime) return data.timestamp <= isoFromNow(endTime);
  if (startTime && !endTime) return data.timestamp >= isoFromNow(startTime);

  return withinDateRange(
    data.timestamp,
    isoFromNow(startTime as number),
    isoFromNow(endTime as number)
  );
};
