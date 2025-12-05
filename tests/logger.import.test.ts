describe("logger module branches", () => {
  it("loads pino logger when NODE_ENV is not test", () => {
    const originalEnv = { ...process.env };
    process.env.NODE_ENV = "development";
    process.env.DISABLE_PINO_TRANSPORT = "1";
    // ensure fresh module load with modified env
    jest.resetModules();
    const logger = require("../src/utils/logger").default;
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.child).toBe("function");

    // restore
    process.env = originalEnv;
    jest.resetModules();
  });
});
