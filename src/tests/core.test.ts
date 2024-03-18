import { Core } from "../core";
import { ErrorData, Storage } from "../types";

const storageMock: { [key in keyof Storage]: jest.Mock } = {
  createError: jest.fn(),
  findErrorIdByFingerprint: jest.fn(),
  addOccurence: jest.fn(),
  updateLastOccurenceOnError: jest.fn(),
};

const core = new Core(storageMock as Storage);

// Using this to test the protected methods
class ProtectedCore extends Core {
  constructor() {
    super(storageMock as Storage);
  }

  publicGenerateFingerPrint(error: Error) {
    return this._generateFingerprint(error);
  }
}

const protectedCore = new ProtectedCore();

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

      describe("given there are no existing error with the same fingerprint", () => {
        it("should call the createError method on the storage", async () => {
          await core.handleError(testError);
          expect(storageMock.createError).toHaveBeenCalledTimes(1);
          const expected: Omit<ErrorData, "id"> = {
            fingerprint,
            lastOccurenceTimestamp: expect.any(String),
            muted: false,
            name: testError.name,
            stack: testError.stack as string,
            totalOccurences: 1,
          };
          expect(storageMock.createError).toHaveBeenCalledWith(expected);
        });
      });

      const errorId = "1";
      it("should add a new occurence to the error", async () => {
        storageMock.findErrorIdByFingerprint.mockResolvedValue(errorId);
        await core.handleError(testError);
        expect(storageMock.addOccurence).toHaveBeenCalledTimes(1);
        expect(storageMock.addOccurence).toHaveBeenCalledWith({
          errorId,
          message: testError.message,
          timestamp: expect.any(String),
        });
      });

      //   // it("should increment the occurences of the existing error and update the last occurence time", async () => {});
    });
  });

  describe("_generateFingerprint", () => {
    it("should generate a unique id", async () => {
      const fingerPrint = protectedCore.publicGenerateFingerPrint(testError);
      expect(fingerPrint).toBeDefined();
      expect(typeof fingerPrint).toBe("string");
      expect(fingerPrint.length).toBeGreaterThan(0);
    });
  });
});
