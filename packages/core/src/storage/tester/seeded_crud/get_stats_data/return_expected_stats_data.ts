import { StorageTest } from "src/storage/tester/storage_test";
import {
  GetStorageFunc,
  IsoFromNow,
  ModdedStatsData,
  TestCase,
  TestIssueData,
} from "src/storage/tester/types";
import { withinDateRange } from "src/storage/tester/utils";
import { StatsData } from "src/types";

export class ReturnExpectedStatsData extends StorageTest {
  isoFromNow: IsoFromNow;
  issuesData: TestIssueData[];

  constructor(
    getStorage: GetStorageFunc,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);
    this.isoFromNow = isoFromNow;
    this.issuesData = issuesData;
  }

  private createTestCase(
    startTime: number,
    endTime: number,
    timezoneOffset: number = new Date().getTimezoneOffset()
  ): TestCase {
    const dateFilterFn = (data: TestIssueData) => {
      const start = this.isoFromNow(startTime);
      const end = this.isoFromNow(endTime);
      if (data.overrides?.lastOccurrenceTimestamp) {
        if (
          withinDateRange(data.overrides.lastOccurrenceTimestamp, start, end)
        ) {
          return true;
        }
      }
      return withinDateRange(data.timestamp, start, end);
    };

    const getIncrement = (issueData: TestIssueData) => {
      if (
        issueData.overrides?.lastOccurrenceTimestamp &&
        issueData.overrides.totalOccurrences
      ) {
        // If last occurrence timestamp exists in overrides then total occurrences should as well.
        const lastWithin = withinDateRange(
          issueData.overrides.lastOccurrenceTimestamp,
          this.isoFromNow(startTime),
          this.isoFromNow(endTime)
        );
        const timestampWithin = withinDateRange(
          issueData.timestamp,
          this.isoFromNow(startTime),
          this.isoFromNow(endTime)
        );
        const both = lastWithin && timestampWithin;

        if (both) {
          return issueData.overrides.totalOccurrences;
        } else {
          if (lastWithin) return 1;
          if (timestampWithin) return issueData.overrides.totalOccurrences - 1;

          return 0;
        }
      } else {
        return issueData.overrides?.totalOccurrences ?? 1;
      }
    };

    const dailyOccurrenceCountReduceFn = (
      agg: StatsData["dailyOccurrenceCount"],
      data: TestIssueData
    ) => {
      const timestamp =
        data.overrides?.lastOccurrenceTimestamp || data.timestamp;
      // Format the timestamp for the current timezone and get the date part.
      const date = new Date(
        new Date(timestamp).getTime() - timezoneOffset * 60 * 1000
      );
      const dateStr = date.toISOString().split("T")[0];

      const existingIndex = agg.findIndex((item) => item.date === dateStr);
      if (existingIndex > -1) {
        agg[existingIndex].count += getIncrement(data);

        return agg;
      } else {
        return [...agg, { date: dateStr, count: getIncrement(data) }];
      }
    };

    const totalReduceFn = (agg: number, data: TestIssueData) => {
      return agg + getIncrement(data);
    };

    return {
      filter: {
        startDate: this.isoFromNow(startTime),
        endDate: this.isoFromNow(endTime),
        timezoneOffset,
      },

      expectedStats: {
        dailyOccurrenceCount: this.issuesData
          .filter(dateFilterFn)
          .reduce(
            dailyOccurrenceCountReduceFn,
            [] as StatsData["dailyOccurrenceCount"]
          ),

        dailyUnhandledOccurrenceCount: this.issuesData
          .filter(
            (data) =>
              dateFilterFn(data) && data.overrides && data.overrides.unhandled
          )
          .reduce(
            dailyOccurrenceCountReduceFn,
            [] as StatsData["dailyOccurrenceCount"]
          ),

        mostRecurringIssuesFprints: this.issuesData
          .filter(dateFilterFn)
          .sort((a, b) => {
            // Sort by total occurrences in descending order
            const aCount = getIncrement(a);
            const bCount = getIncrement(b);
            const countDiff = bCount - aCount;
            if (countDiff !== 0) return countDiff;

            // and then by last occurrence timestamp in descending order (latest first)
            const aTime = new Date(
              a.overrides?.lastOccurrenceTimestamp || a.timestamp
            ).getTime();
            const bTime = new Date(
              b.overrides?.lastOccurrenceTimestamp || b.timestamp
            ).getTime();
            return bTime - aTime;
          })
          .slice(0, 5)
          .map((data) => data.overrides?.fingerprint || "nothing_like_this"),

        totalIssues: this.issuesData.filter(dateFilterFn).length,

        totalLoggedData: this.issuesData
          .filter(
            (data) =>
              data.overrides && data.overrides.isLog && dateFilterFn(data)
          )
          .reduce(totalReduceFn, 0),
        totalManuallyCapturedOccurrences: this.issuesData
          .filter(
            (data) =>
              dateFilterFn(data) &&
              data.overrides &&
              !data.overrides.unhandled &&
              !data.overrides.isLog
          )
          .reduce(totalReduceFn, 0),
        totalOccurrences: this.issuesData
          .filter(dateFilterFn)
          .reduce(totalReduceFn, 0),
        totalUnhandledOccurrences: this.issuesData
          .filter(
            (data) =>
              dateFilterFn(data) && data.overrides && data.overrides.unhandled
          )
          .reduce(totalReduceFn, 0),
      },
    };
  }

  run(): void {
    it("should return the expected stats data for the supplied filters", async () => {
      let otherTimezone = new Date().getTimezoneOffset() + 120;
      if (otherTimezone > 60 * 13) otherTimezone = 0;

      const dataSet: TestCase[] = [
        this.createTestCase(10000, 0),
        // this.createTestCase(25000, 5000),
        // this.createTestCase(35000, 2000),
        // this.createTestCase(15000, 10000),
        // this.createTestCase(35000, 20000),

        // this.createTestCase(10000, 0, otherTimezone),
        // this.createTestCase(25000, 5000, otherTimezone),
        // this.createTestCase(35000, 2000, otherTimezone),
        // this.createTestCase(15000, 10000, otherTimezone),
        // this.createTestCase(35000, 20000, otherTimezone),
      ];
      const storage = await this.getStorage();

      try {
        for (const testCase of dataSet) {
          const result = await storage.getStatsData(testCase.filter);
          const moddedResult: ModdedStatsData = {
            ...result,
            mostRecurringIssuesFprints: result.mostRecurringIssues.map(
              (issue) => issue.fingerprint
            ),
          };
          expect(moddedResult).toMatchObject(testCase.expectedStats);
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
