import { CnpjValueObject } from "src/domain/value-objects/cnpj/cnpj";

describe("CnpjValueObject", () => {
  const VALID_CNPJ = "11222333000181";
  const VALID_CNPJ_FORMATTED = "11.222.333/0001-81";

  it("should create instance with valid CNPJ (numeric only)", () => {
    const cnpj = CnpjValueObject.create(VALID_CNPJ);
    expect(cnpj).toBeInstanceOf(CnpjValueObject);
    expect(cnpj.getValue()).toBe(VALID_CNPJ);
  });

  it("should create instance with valid formatted CNPJ (strips non-digits)", () => {
    const cnpj = CnpjValueObject.create(VALID_CNPJ_FORMATTED);
    expect(cnpj.getValue()).toBe(VALID_CNPJ);
  });

  it("should throw when CNPJ is empty", () => {
    expect(() => CnpjValueObject.create("")).toThrow("CNPJ é obrigatório");
  });

  it("should throw when CNPJ has less than 14 digits", () => {
    expect(() => CnpjValueObject.create("1234567890123")).toThrow(
      "CNPJ deve conter exatamente 14 dígitos numéricos",
    );
  });

  it("should throw when CNPJ has more than 14 digits", () => {
    expect(() => CnpjValueObject.create("123456789012345")).toThrow(
      "CNPJ deve conter exatamente 14 dígitos numéricos",
    );
  });

  it("should throw when all digits are the same", () => {
    expect(() => CnpjValueObject.create("11111111111111")).toThrow(
      "CNPJ inválido",
    );
    expect(() => CnpjValueObject.create("00000000000000")).toThrow(
      "CNPJ inválido",
    );
  });
});
