import { hashPassword, comparePassword } from "../src/utils/passwordUtils";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("utils/passwordUtils", () => {
  beforeEach(() => jest.clearAllMocks());

  it("hashPassword resolves to hashed value", async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-value");

    const res = await hashPassword("mypassword");

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("mypassword", "salt");
    expect(res).toBe("hashed-value");
  });

  it("comparePassword returns bcrypt.compare result", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const ok = await comparePassword("plain", "hashed");
    expect(bcrypt.compare).toHaveBeenCalledWith("plain", "hashed");
    expect(ok).toBe(true);
  });
});
