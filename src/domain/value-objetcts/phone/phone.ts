export class PhoneValueObject {
  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(phone: string): PhoneValueObject {
    const formatted = this.format(phone);
    return new PhoneValueObject(formatted);
  }

  getPhone(): string {
    return this.value;
  }

  validate(): void {
    if (!this.value || this.value.trim() === "") {
      throw new Error("Telefone inválido");
    }

    const cleanPhone = this.value.replace(/\D/g, "");

    if (!/^\d+$/.test(cleanPhone)) {
      throw new Error("Telefone inválido");
    }

    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      throw new Error("Telefone inválido");
    }

    if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== "9") {
      throw new Error("Telefone inválido");
    }

    if (cleanPhone.length === 10 && cleanPhone.charAt(2) === "9") {
      throw new Error("Telefone inválido");
    }
  }

  private static format(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
    } else {
      // Fixo: (XX) XXXX-XXXX
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
    }
  }
}
