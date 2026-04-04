import { CpfValueObject } from "src/domain/value-objects/cpf/cpf";

describe("CpfValueObject", () => {
  const VALID_CPF = "52998224725";
  const VALID_CPF_FORMATTED = "529.982.247-25";

  it("should create instance when valid cpf numeric only is provided", () => {
    const cpf = CpfValueObject.create(VALID_CPF);
    expect(cpf).toBeInstanceOf(CpfValueObject);
    expect(cpf.getValue()).toBe(VALID_CPF);
  });

  it("should create instance when valid formatted cpf is provided", () => {
    const cpf = CpfValueObject.create(VALID_CPF_FORMATTED);
    expect(cpf.getValue()).toBe(VALID_CPF);
  });

  it("should throw when cpf is empty", () => {
    expect(() => CpfValueObject.create("")).toThrow("CPF é obrigatório");
  });

  it("should throw when cpf has less than 11 digits", () => {
    expect(() => CpfValueObject.create("1234567890")).toThrow(
      "CPF deve conter exatamente 11 dígitos numéricos",
    );
  });

  it("should throw when cpf has more than 11 digits", () => {
    expect(() => CpfValueObject.create("123456789012")).toThrow(
      "CPF deve conter exatamente 11 dígitos numéricos",
    );
  });

  it("should throw when all digits are the same", () => {
    expect(() => CpfValueObject.create("11111111111")).toThrow("CPF inválido");
    expect(() => CpfValueObject.create("000.000.000-00")).toThrow(
      "CPF inválido",
    );
  });

  it("should throw when check digits are invalid", () => {
    expect(() => CpfValueObject.create("52998224700")).toThrow("CPF inválido");
  });
});
