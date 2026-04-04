export class CpfValueObject {
  private readonly value: string;

  private constructor(cpf: string) {
    const cleaned = CpfValueObject.clean(cpf);
    CpfValueObject.validate(cleaned);
    this.value = cleaned;
  }

  static create(cpf: string): CpfValueObject {
    return new CpfValueObject(cpf);
  }

  getValue(): string {
    return this.value;
  }

  private static clean(cpf: string): string {
    if (!cpf) return "";
    return cpf.replace(/\D/g, "");
  }

  private static validate(cpf: string): void {
    if (!cpf) {
      throw new Error("CPF é obrigatório");
    }

    if (cpf.length !== 11) {
      throw new Error("CPF deve conter exatamente 11 dígitos numéricos");
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      throw new Error("CPF inválido");
    }

    if (!CpfValueObject.validateCheckDigits(cpf)) {
      throw new Error("CPF inválido");
    }
  }

  private static validateCheckDigits(cpf: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
  }
}
