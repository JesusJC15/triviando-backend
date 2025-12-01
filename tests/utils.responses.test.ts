import { unauthorized, forbidden } from "../src/utils/responses";

describe("responses utils", () => {
  it("unauthorized sets 401 and message", () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };

    unauthorized(res, "No auth");

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ message: "No auth" });
  });

  it("forbidden sets 403 and default message", () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };

    forbidden(res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ message: "Forbidden" });
  });
});
