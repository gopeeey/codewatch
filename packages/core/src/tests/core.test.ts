import { Issue } from "@codewatch/types";
import { CaptureDataOpts, Core } from "../core";
import { MockStorage } from "./mock_storage";

beforeEach(() => {
  MockStorage.createInstance();
  Core.init(MockStorage.getInstance());
});

afterEach(async () => {
  try {
    await Core.close();
  } catch (err) {}
});

const testError = new Error("Hello world");
describe("Core", () => {
  describe("init", () => {
    it("should add a listener for unhandled errors", async () => {
      await Core.close();
      expect(process.listenerCount("uncaughtException")).toBe(0);
      expect(process.listenerCount("unhandledRejection")).toBe(0);
      MockStorage.createInstance();
      Core.init(MockStorage.getInstance());
      expect(process.listenerCount("uncaughtException")).toBe(1);
      expect(process.listenerCount("unhandledRejection")).toBe(1);
    });
  });

  describe("captureError", () => {
    describe("when data is not an error or the error has no stack", () => {
      it("should do nothing", async () => {
        const dataSet = [
          "Hello world",
          (() => {
            const err = new Error("Hello world");
            err.stack = undefined;
            return err;
          })(),
        ];

        for (const data of dataSet) {
          await Core.captureError(data);
          const storage = MockStorage.getInstance();
          expect(storage.issues.length).toBe(0);
        }
      });
    });

    describe("when data is an error", () => {
      describe("given the error does not already exist in the storage", () => {
        it("should save the error to the storage", async () => {
          const storage = MockStorage.getInstance();
          expect(storage.issues).toHaveLength(0);

          await Core.captureError(testError);
          const expected: Omit<Issue, "fingerprint"> = {
            id: "1",
            resolved: false,
            lastOccurrenceTimestamp: expect.any(String),
            lastOccurrenceMessage: expect.any(String),
            unhandled: false,
            muted: false,
            name: testError.name,
            stack: testError.stack as string,
            totalOccurrences: expect.any(Number),
            createdAt: expect.any(String),
          };
          expect(storage.issues).toHaveLength(1);
          expect(storage.issues[0]).toMatchObject(expected);
        });
      });

      describe("given the error already exists in the storage", () => {
        it("should not create a new error in the storage", async () => {
          await Core.captureError(testError);
          const storage = MockStorage.getInstance();
          expect(storage.issues).toHaveLength(1);
          const prevIssue = Object.assign(storage.issues[0], {});
          await Core.captureError(testError);
          expect(storage.issues).toHaveLength(1);
          expect(prevIssue).toMatchObject({
            ...storage.issues[0],
            lastOccurrenceTimestamp: expect.any(String),
            totalOccurrences: expect.any(Number),
          });
        });
      });

      const issueId = "1";
      describe("given logs are not disabled", () => {
        it("should add a new occurrence with logs to the error", async () => {
          const logBeforeError =
            "something logged to the console before the error";
          const errLogBeforeError =
            "something else was logged to stderr before the error";
          console.log(logBeforeError);
          console.info(logBeforeError);
          console.error(errLogBeforeError);
          console.warn(errLogBeforeError);

          const storage = MockStorage.getInstance();
          expect(storage.occurrences).toHaveLength(0);

          await Core.captureError(testError);

          expect(storage.occurrences).toHaveLength(1);

          const savedOccurrence = storage.occurrences[0];
          expect(savedOccurrence).toMatchObject({
            issueId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
            systemInfo: {
              deviceMemory: expect.any(Number),
              freeMemory: expect.any(Number),
              appMemoryUsage: expect.any(Number),
              deviceUptime: expect.any(Number),
              appUptime: expect.any(Number),
            },
          });

          expect(savedOccurrence.stdoutLogs).toHaveLength(2);
          expect(savedOccurrence.stderrLogs).toHaveLength(2);
          expect(savedOccurrence.stdoutLogs[0].message).toBe(logBeforeError);
          expect(savedOccurrence.stdoutLogs[1].message).toBe(logBeforeError);
          expect(savedOccurrence.stderrLogs[0].message).toBe(errLogBeforeError);
          expect(savedOccurrence.stderrLogs[1].message).toBe(errLogBeforeError);
        });

        it("should only retain logs for the specified amount of time", async () => {
          await Core.close();
          MockStorage.createInstance();
          const storage = MockStorage.getInstance();
          Core.init(storage, {
            stderrLogRetentionTime: 100,
            stdoutLogRetentionTime: 100,
          });

          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.log(logBeforeError);
          console.error(logBeforeError);

          await new Promise((resolve) => setTimeout(resolve, 200));

          console.log(logBeforeError);

          await Core.captureError(testError);

          const savedOccurrence = storage.occurrences[0];

          expect(savedOccurrence.stdoutLogs).toHaveLength(1); // Should have just 1 because of the console.log after the 200ms timeout
          expect(savedOccurrence.stderrLogs).toHaveLength(0);
        });
      });

      describe("given logs are disabled", () => {
        it("should add a new occurrence without logs to the error", async () => {
          await Core.close();
          MockStorage.createInstance();
          const storage = MockStorage.getInstance();
          Core.init(storage, { disableConsoleLogs: true });

          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.error(logBeforeError);

          expect(storage.occurrences).toHaveLength(0);
          await Core.captureError(testError);

          expect(storage.occurrences).toHaveLength(1);
          const savedOccurrence = storage.occurrences[0];
          expect(savedOccurrence).toMatchObject({
            issueId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
          });

          expect(savedOccurrence.stdoutLogs).toHaveLength(0);
          expect(savedOccurrence.stderrLogs).toHaveLength(0);
        });
      });

      it("should increment the total occurrences of the existing error and update the last occurrence time", async () => {
        await Core.captureError(testError);
        const timeAtFirst = Date.now();

        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        await Core.captureError(testError);

        const storage = MockStorage.getInstance();
        expect(storage.issues).toHaveLength(1);

        const issue = storage.issues[0];
        expect(issue.totalOccurrences).toBe(2);
        expect(issue.lastOccurrenceTimestamp).toBeDefined();
        expect(
          new Date(issue.lastOccurrenceTimestamp).getTime()
        ).toBeGreaterThan(timeAtFirst);
      });
    });
  });

  describe("captureData", () => {
    describe("when data is not an object", () => {
      it("should do nothing", async () => {
        const dataSet = ["Hello world", 1, [1, 3, 4], true, null, undefined];

        for (const data of dataSet) {
          await Core.captureData(data as object);
          const storage = MockStorage.getInstance();
          expect(storage.issues.length).toBe(0);
        }
      });
    });

    describe("when data is an object", () => {
      it("should save the data to the storage", async () => {
        const storage = MockStorage.getInstance();
        expect(storage.issues).toHaveLength(0);

        const anonymous = "AnonymousData";
        const scenarios: {
          args: [Record<any, any>, CaptureDataOpts?];
          expected: Pick<Issue, "name" | "lastOccurrenceMessage">;
        }[] = [
          {
            args: [{ test: "test" }],
            expected: { name: anonymous, lastOccurrenceMessage: "" },
          },
          {
            args: [{ test: "test" }, { name: "My Data" }],
            expected: { name: "My Data", lastOccurrenceMessage: "" },
          },
          {
            args: [
              { something: "it all" },
              { name: "SomethingElse", message: "something else entirely" },
            ],
            expected: {
              name: "SomethingElse",
              lastOccurrenceMessage: "something else entirely",
            },
          },
        ];

        for (let i = 0; i < scenarios.length; i++) {
          const scenario = scenarios[i];
          await Core.captureData(scenario.args[0], scenario.args[1]);
          expect(storage.issues).toHaveLength(1);
          const issue = storage.issues[0];
          expect(issue).toMatchObject(scenario.expected);
          expect(storage.occurrences).toHaveLength(1);
          const occurrence = storage.occurrences[0];
          expect(occurrence).toMatchObject({ extraData: scenario.args[0] });
          storage.issues = [];
          storage.occurrences = [];
        }
      });
    });
  });

  describe("close", () => {
    it("should close the storage", async () => {
      expect.assertions(1);
      await Core.close();
      try {
        MockStorage.getInstance();
      } catch (err) {
        if (!(err instanceof Error)) throw new Error("Mock storage not closed");
        expect(err.message).toBe("No mock storage instance");
      }
    });

    it("should remove the listener for unhandled errors", async () => {
      await Core.close();
      expect(process.listenerCount("uncaughtException")).toBe(0);
      expect(process.listenerCount("unhandledRejection")).toBe(0);
    });
  });
});
