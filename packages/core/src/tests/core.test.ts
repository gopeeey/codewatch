import { Core } from "../core";
import { Storage } from "../types";

const storageMock: {
  [key in keyof Pick<
    Storage,
    | "createIssue"
    | "addOccurrence"
    | "close"
    | "findIssueIdByFingerprint"
    | "updateLastOccurrenceOnIssue"
  >]: jest.Mock;
} = {
  createIssue: jest.fn(),
  findIssueIdByFingerprint: jest.fn(),
  addOccurrence: jest.fn(),
  updateLastOccurrenceOnIssue: jest.fn(),
  close: jest.fn(),
};

const core = new Core(storageMock as unknown as Storage);

const testError = new Error("Hello world");
describe("Core", () => {
  describe("handleError", () => {
    describe("when data is not an error or the error has no stack", () => {
      it("should throw what was passed", async () => {
        const dataSet = [
          "Hello world",
          (() => {
            const err = new Error("Hello world");
            err.stack = undefined;
            return err;
          })(),
        ];

        expect.assertions(dataSet.length);
        for (const data of dataSet) {
          try {
            await core.handleError(data);
          } catch (err) {
            expect(err).toBe(data);
          }
        }
      });
    });

    describe("when data is an error", () => {
      const generateFingerprintSpy = jest.spyOn(
        core as any,
        "_generateFingerprint"
      );
      const fingerprint = "fingerprint";
      generateFingerprintSpy.mockReturnValue(fingerprint);

      it("should generate a fingerprint", async () => {
        await core.handleError(testError);
        expect(generateFingerprintSpy).toHaveBeenCalledWith(testError);
      });

      it("should check storage for an existing error with the same fingerprint", async () => {
        await core.handleError(testError);
        expect(storageMock.findIssueIdByFingerprint).toHaveBeenCalledTimes(1);
        expect(storageMock.findIssueIdByFingerprint).toHaveBeenCalledWith(
          fingerprint
        );
      });

      describe("given there are no existing errors with the same fingerprint", () => {
        it("should call the createIssue method on the storage", async () => {
          await core.handleError(testError);
          expect(storageMock.createIssue).toHaveBeenCalledTimes(1);
          const expected: Parameters<Storage["createIssue"]>[number] = {
            fingerprint,
            lastOccurrenceTimestamp: expect.any(String),
            lastOccurrenceMessage: expect.any(String),
            unhandled: false,
            muted: false,
            name: testError.name,
            stack: testError.stack as string,
            totalOccurrences: 0,
            createdAt: expect.any(String),
          };
          expect(storageMock.createIssue).toHaveBeenCalledWith(expected);
        });
      });

      const issueId = "1";
      describe("given logs are not disabled", () => {
        it("should add a new occurrence with logs to the error", async () => {
          storageMock.findIssueIdByFingerprint.mockResolvedValue(issueId);
          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.error(logBeforeError);
          console.warn(logBeforeError);
          console.info(logBeforeError);

          await core.handleError(testError);

          expect(storageMock.addOccurrence).toHaveBeenCalledTimes(1);

          expect(storageMock.addOccurrence).toHaveBeenCalledWith({
            issueId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
          });

          const calls = storageMock.addOccurrence.mock.calls;
          expect(calls[0][0].stdoutLogs[0].message).toBe(logBeforeError);
          expect(calls[0][0].stdoutLogs[1]?.message).toBe(logBeforeError);

          expect(calls[0][0].stderrLogs[0].message).toBe(logBeforeError);
          expect(calls[0][0].stderrLogs[1]?.message).toBe(logBeforeError);
        });
      });

      describe("given logs are disabled", () => {
        it("should add a new occurrence without logs to the error", async () => {
          const newCore = new Core(storageMock as unknown as Storage, {
            disableConsoleLogs: true,
          });
          storageMock.findIssueIdByFingerprint.mockResolvedValue(issueId);
          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.error(logBeforeError);

          await newCore.handleError(testError);

          expect(storageMock.addOccurrence).toHaveBeenCalledTimes(1);

          expect(storageMock.addOccurrence).toHaveBeenCalledWith({
            issueId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
          });

          const calls = storageMock.addOccurrence.mock.calls;
          expect(calls[0][0].stdoutLogs.length).toBe(0);
          expect(calls[0][0].stderrLogs.length).toBe(0);
        });
      });

      it("should increment the total occurrences of the existing error and update the last occurrence time", async () => {
        await core.handleError(testError);
        expect(storageMock.updateLastOccurrenceOnIssue).toHaveBeenCalledTimes(
          1
        );
        expect(storageMock.updateLastOccurrenceOnIssue).toHaveBeenCalledWith({
          issueId,
          timestamp: expect.any(String),
          message: testError.message,
        });
      });
    });

    describe("when close has been called", () => {
      it("should throw an error", async () => {
        await core.close();
        expect.assertions(1);
        try {
          await core.handleError(testError);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe("close", () => {
    it("should close the storage", async () => {
      await core.close();
      expect(storageMock.close).toHaveBeenCalledTimes(1);
    });
  });
});
