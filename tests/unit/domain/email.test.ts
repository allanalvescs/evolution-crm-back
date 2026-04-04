import { EmailValueObject } from "src/domain/value-objects/email/email";

describe("Email Value Object", () => {
  it("Should create an instance of Email with valid email", () => {
    const email = EmailValueObject.create("jonhdoe@gmail.com");
    expect(email).toBeInstanceOf(EmailValueObject);
    expect(email.getEmail()).toBe("jonhdoe@gmail.com");
  });

  it("Should throw an error when creating an Email with invalid email", () => {
    expect(() => EmailValueObject.create("invalid-email")).toThrow(
      "Formato de email inválido",
    );
  });

  it("Should throw an error when creating an Email with empty string", () => {
    expect(() => EmailValueObject.create("")).toThrow("Email é obrigatório");
  });

  it("Should throw an error when creating an Email with null", () => {
    expect(() => EmailValueObject.create(null as any)).toThrow(
      "Email é obrigatório",
    );
  });
});
