import { Issue } from "@codewatch/types";
import { Core } from "../core";
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

  describe("handleError", () => {
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
          await Core.handleError(data);
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

          await Core.handleError(testError);
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
          await Core.handleError(testError);
          const storage = MockStorage.getInstance();
          expect(storage.issues).toHaveLength(1);
          const prevIssue = Object.assign(storage.issues[0], {});
          await Core.handleError(testError);
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

          await Core.handleError(testError);

          expect(storage.occurrences).toHaveLength(1);

          const savedOccurrence = storage.occurrences[0];
          expect(savedOccurrence).toMatchObject({
            issueId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
          });

          expect(savedOccurrence.stdoutLogs).toHaveLength(2);
          expect(savedOccurrence.stderrLogs).toHaveLength(2);
          expect(savedOccurrence.stdoutLogs[0].message).toBe(logBeforeError);
          expect(savedOccurrence.stdoutLogs[1].message).toBe(logBeforeError);
          expect(savedOccurrence.stderrLogs[0].message).toBe(errLogBeforeError);
          expect(savedOccurrence.stderrLogs[1].message).toBe(errLogBeforeError);
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
          await Core.handleError(testError);

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
        await Core.handleError(testError);
        const timeAtFirst = Date.now();

        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        await Core.handleError(testError);

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
