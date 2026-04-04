export class EmailValueObject {
  constructor(private value: string) {
    this.validate();
  }

  static create(value: string): EmailValueObject {
    return new EmailValueObject(value);
  }

  validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.value || typeof this.value !== "string") {
      throw new Error("Email é obrigatório");
    }

    const trimmedValue = this.value.trim().toLowerCase();

    if (!emailRegex.test(trimmedValue)) {
      throw new Error("Formato de email inválido");
    }
  }

  getEmail(): string {
    return this.value;
  }
}
