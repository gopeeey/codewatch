import { Core } from "../core";
import { ErrorData, Storage } from "../types";

const storageMock: { [key in keyof Storage]: jest.Mock } = {
  createError: jest.fn(),
  findErrorIdByFingerprint: jest.fn(),
  addOccurrence: jest.fn(),
  updateLastOccurrenceOnError: jest.fn(),
  close: jest.fn(),
};

const core = new Core(storageMock as Storage);

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
        expect(storageMock.findErrorIdByFingerprint).toHaveBeenCalledTimes(1);
        expect(storageMock.findErrorIdByFingerprint).toHaveBeenCalledWith(
          fingerprint
        );
      });

      describe("given there are no existing errors with the same fingerprint", () => {
        it("should call the createError method on the storage", async () => {
          await core.handleError(testError);
          expect(storageMock.createError).toHaveBeenCalledTimes(1);
          const expected: Omit<ErrorData, "id"> = {
            fingerprint,
            lastOccurrenceTimestamp: expect.any(String),
            lastOccurrenceMessage: expect.any(String),
            unhandled: false,
            muted: false,
            name: testError.name,
            stack: testError.stack as string,
            totalOccurrences: 1,
            createdAt: expect.any(String),
          };
          expect(storageMock.createError).toHaveBeenCalledWith(expected);
        });
      });

      const errorId = "1";
      describe("given logs are not disabled", () => {
        it("should add a new occurrence with logs to the error", async () => {
          storageMock.findErrorIdByFingerprint.mockResolvedValue(errorId);
          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.error(logBeforeError);
          console.warn(logBeforeError);
          console.info(logBeforeError);

          await core.handleError(testError);

          expect(storageMock.addOccurrence).toHaveBeenCalledTimes(1);

          expect(storageMock.addOccurrence).toHaveBeenCalledWith({
            errorId,
            message: testError.message,
            timestamp: expect.any(String),
            stdoutLogs: expect.any(Array),
            stderrLogs: expect.any(Array),
          });

          const calls = storageMock.addOccurrence.mock.calls;
          expect(calls[0][0].stdoutLogs[0].includes(logBeforeError)).toBe(true);
          expect(calls[0][0].stdoutLogs[1]?.includes(logBeforeError)).toBe(
            true
          );

          expect(calls[0][0].stderrLogs[0].includes(logBeforeError)).toBe(true);
          expect(calls[0][0].stderrLogs[1]?.includes(logBeforeError)).toBe(
            true
          );
        });
      });

      describe("given logs are disabled", () => {
        it("should add a new occurrence without logs to the error", async () => {
          const newCore = new Core(storageMock as Storage, {
            disableConsoleLogs: true,
          });
          storageMock.findErrorIdByFingerprint.mockResolvedValue(errorId);
          const logBeforeError =
            "something logged to the console before the error";
          console.log(logBeforeError);
          console.error(logBeforeError);

          await newCore.handleError(testError);

          expect(storageMock.addOccurrence).toHaveBeenCalledTimes(1);

          expect(storageMock.addOccurrence).toHaveBeenCalledWith({
            errorId,
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
        expect(storageMock.updateLastOccurrenceOnError).toHaveBeenCalledTimes(
          1
        );
        expect(storageMock.updateLastOccurrenceOnError).toHaveBeenCalledWith({
          errorId,
          timestamp: expect.any(String),
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
