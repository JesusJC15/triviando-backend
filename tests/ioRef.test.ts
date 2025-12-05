import { setIo, getIo } from "../src/socket/ioRef";

describe("socket/ioRef", () => {
  beforeEach(() => {
    // reset by setting null via module scope isn't exposed; rely on initial state
  });

  it("setIo and getIo should store and return the reference", () => {
    expect(getIo()).toBeNull();
    const fake = { to: jest.fn() } as any;
    setIo(fake);
    expect(getIo()).toBe(fake);
  });
});
