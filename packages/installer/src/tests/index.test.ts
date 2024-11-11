import main from "..";
import { RegistryMock, TerminalMock } from "./mocks";

const terminal = new TerminalMock();
const registry = new RegistryMock();

describe("main", () => {
  it("should query the user for their stack", async () => {
    await main(registry, terminal);
    expect(terminal.select).toHaveBeenCalledTimes(2);

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("server framework"),
      options: expect.any(Array),
    });

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("storage"),
      options: expect.any(Array),
    });
  });
});
