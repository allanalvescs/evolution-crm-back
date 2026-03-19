import { PhoneValueObject } from "./phone";

describe("Phone Value Object", () => {
  it("Should create an instance of Phone with valid phone number", () => {
    const phone = PhoneValueObject.create("11987654321");
    expect(phone.getPhone()).toBe("(11) 98765-4321");
  });

  it("Should throw an error for invalid phone number format", () => {
    expect(() => PhoneValueObject.create("12345")).toThrow("Telefone inválido");
    expect(() => PhoneValueObject.create("abcdefghijk")).toThrow(
      "Telefone inválido",
    );
    expect(() => PhoneValueObject.create("(11) 9876-5432")).toThrow(
      "Telefone inválido",
    );
  });

  it("Should throw an error for empty phone number", () => {
    expect(() => PhoneValueObject.create("")).toThrow("Telefone inválido");
  });
});
