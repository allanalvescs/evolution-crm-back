import { BcryptPasswordHasher } from "./bcrypt-password-hasher.service";

describe("BCryptPasswordHasher", () => {

  it("Should be generate a hash and compare it correctly", async () => {
    const passwordHasher = new BcryptPasswordHasher();

    const password = "my_secure_password";
    const hash = await passwordHasher.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[ayb]\$.{56}$/);
  });

});