import { EClientType } from "../../../shared/enum/client-type";

export class CpfCnpj {
  private cpf: string;
  private cnpj: string;
  private type: EClientType;

  constructor(value: string, type: EClientType) {
    this.validate(value, type);

    this.cpf = type === EClientType.PF ? value : "";
    this.cnpj = type === EClientType.PJ ? value : "";
    this.type = type;
  }

  getCpf(): string {
    return this.cpf;
  }

  getCnpj(): string {
    return this.cnpj;
  }

  getType(): EClientType {
    return this.type;
  }

  isCpf(): boolean {
    return this.type === EClientType.PF;
  }

  isCnpj(): boolean {
    return this.type === EClientType.PJ;
  }

  private validate(value: string, type: EClientType): void {
    this.validateRequiredFields(value, type);
    this.validateCpf(type, value);
    this.validateCnpj(type, value);
  }

  private validateRequiredFields(value: string, type?: EClientType): void {
    if (!value) {
      throw new Error("CPF ou CNPJ deve ser fornecido");
    }

    if (!type || (type !== EClientType.PF && type !== EClientType.PJ)) {
      throw new Error("O tipo do cliente deve ser PF ou PJ");
    }
  }

  validateCpf(type: EClientType, value: string): void {
    if (type === EClientType.PF && !value) {
      throw new Error("CPF deve ser fornecido para clientes do tipo PF");
    }

    if (type === EClientType.PJ && value.length !== 14) {
      throw new Error("CNPJ deve conter exatos 14 dígitos para PJ");
    }
  }

  validateCnpj(type: EClientType, value: string): void {
    if (type === EClientType.PJ && !value) {
      throw new Error("CNPJ deve ser fornecido para clientes do tipo PJ");
    }

    if (type === EClientType.PF && value.length !== 11) {
      throw new Error("CPF deve conter exatos 11 dígitos para PF");
    }
  }
}
