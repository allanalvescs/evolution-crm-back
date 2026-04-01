export class CnpjValueObject {
  private readonly value: string;

  private constructor(cnpj: string) {
    const cleaned = CnpjValueObject.clean(cnpj);
    CnpjValueObject.validate(cleaned);
    this.value = cleaned;
  }

  static create(cnpj: string): CnpjValueObject {
    return new CnpjValueObject(cnpj);
  }

  getValue(): string {
    return this.value;
  }

  private static clean(cnpj: string): string {
    if (!cnpj) return "";
    return cnpj.replace(/\D/g, "");
  }

  private static validate(cnpj: string): void {
    if (!cnpj) {
      throw new Error("CNPJ é obrigatório");
    }

    if (cnpj.length !== 14) {
      throw new Error("CNPJ deve conter exatamente 14 dígitos numéricos");
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
      throw new Error("CNPJ inválido");
    }
  }
}
