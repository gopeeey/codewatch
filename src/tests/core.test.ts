import { Core } from "../core";
import { Storage } from "../types";

const storageMock: { [key in keyof Storage]: jest.Mock } = {
  save: jest.fn(),
  getErrorIdByFingerPrint: jest.fn(),
};

const core = new Core(storageMock as Storage);

// Using this to test the protected methods
class ProtectedCore extends Core {
  constructor() {
    super(storageMock as Storage);
  }

  publicGenerateFingerPrint(error: Error) {
    return this._generateFingerPrint(error);
  }
}

const protectedCore = new ProtectedCore();

const testError = new Error("Hello world");
describe("Core", () => {
  describe("handleError", () => {
    describe("when data is not an error", () => {
      it("should ignore for now", async () => {
        await core.handleError(1);
        expect(storageMock.save).not.toHaveBeenCalled();
      });
    });

    describe("when data is an error", () => {
      it("should generate a fingerprint", async () => {
        const generateFingerPrintSpy = jest.spyOn(
          core as any,
          "_generateFingerPrint"
        );
        await core.handleError(testError);
        expect(generateFingerPrintSpy).toHaveBeenCalledWith(testError);
      });

      it("should check storage for an existing error with the same fingerprint", async () => {});
    });
  });

  describe("_generateFingerPrint", () => {
    it("should generate a unique id", async () => {
      const fingerPrint = protectedCore.publicGenerateFingerPrint(testError);
      expect(fingerPrint).toBeDefined();
      expect(typeof fingerPrint).toBe("string");
      expect(fingerPrint.length).toBeGreaterThan(0);
    });
  });
});
