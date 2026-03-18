import { EClientType } from "../../../shared/enum/client-type";
import { CpfCnpj } from "./cpf-cnpj";

describe("CpfCnpj", () => {

  it("should be create an instance of CpfCnpj with correct values to CPF", () => {
    const cpf = new CpfCnpj("12345678910", EClientType.PF);

    expect(cpf).toBeInstanceOf(CpfCnpj);
    expect(cpf.getCpf()).toBe("12345678910");
    expect(cpf.isCpf()).toBe(true);
    expect(cpf.isCnpj()).toBe(false);
  });

  it("should be create an instance of CpfCnpj with correct values to CNPJ", () => {
    const cnpj = new CpfCnpj("12345678000195", EClientType.PJ);

    expect(cnpj).toBeInstanceOf(CpfCnpj);
    expect(cnpj.getCnpj()).toBe("12345678000195");
    expect(cnpj.isCnpj()).toBe(true);
    expect(cnpj.isCpf()).toBe(false);
  });

  it("should throw an error if CPF and CNPJ are not provided", () => {
    expect(() => new CpfCnpj("", EClientType.PF)).toThrow("CPF ou CNPJ deve ser fornecido");
    expect(() => new CpfCnpj("", EClientType.PJ)).toThrow("CPF ou CNPJ deve ser fornecido");
  });

  it("should throw an error if type is invalid", () => {
    expect(() => new CpfCnpj("12345678910", "INVALID_TYPE" as any))
      .toThrow("O tipo do cliente deve ser PF ou PJ");
  });

  it("should throw an error if CPF has incorrect length for PF type", () => {
    expect(() => new CpfCnpj("1234567891", EClientType.PF)).toThrow("CPF deve conter exatos 11 dígitos para PF");
    expect(() => new CpfCnpj("123456789101", EClientType.PF)).toThrow("CPF deve conter exatos 11 dígitos para PF");
  });

  it("should throw an error if CNPJ has incorrect length for PJ type", () => {
    expect(() => new CpfCnpj("1234567800019", EClientType.PJ)).toThrow("CNPJ deve conter exatos 14 dígitos para PJ");
    expect(() => new CpfCnpj("123456780001951", EClientType.PJ)).toThrow("CNPJ deve conter exatos 14 dígitos para PJ");
  });

  it("should has cpf when provides value to PF type and cnpj must be empty", () => {
    const cpf = new CpfCnpj("12345678910", EClientType.PF);

    expect(cpf.getCpf()).toBe("12345678910");
    expect(cpf.getCnpj()).toBe("");
  });
});