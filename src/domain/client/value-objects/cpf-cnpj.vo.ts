/**
 * Value Object para CPF/CNPJ
 *
 * Garante validação e imutabilidade de CPF e CNPJ brasileiros.
 * Implementa algoritmo de validação de dígitos verificadores.
 *
 * @example
 * ```typescript
 * const cpf = CpfCnpj.create('123.456.789-09');
 * const cnpj = CpfCnpj.create('12.345.678/0001-90');
 * ```
 */
export class CpfCnpj {
  private constructor(private readonly _value: string) {}

  /**
   * Factory method para criar um CpfCnpj válido
   *
   * @param value - CPF ou CNPJ com ou sem formatação
   * @returns Instância de CpfCnpj
   * @throws {InvalidCpfCnpjException} Se o valor for inválido
   */
  static create(value: string): CpfCnpj {
    if (!value || typeof value !== 'string') {
      throw new InvalidCpfCnpjException('CPF/CNPJ não pode ser vazio');
    }

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      if (!this.validateCpf(cleaned)) {
        throw new InvalidCpfCnpjException('CPF inválido');
      }
    } else if (cleaned.length === 14) {
      if (!this.validateCnpj(cleaned)) {
        throw new InvalidCpfCnpjException('CNPJ inválido');
      }
    } else {
      throw new InvalidCpfCnpjException(
        'CPF/CNPJ deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)',
      );
    }

    return new CpfCnpj(cleaned);
  }

  /**
   * Retorna o valor sem formatação
   */
  get value(): string {
    return this._value;
  }

  /**
   * Verifica se é CPF (11 dígitos)
   */
  isCpf(): boolean {
    return this._value.length === 11;
  }

  /**
   * Verifica se é CNPJ (14 dígitos)
   */
  isCnpj(): boolean {
    return this._value.length === 14;
  }

  /**
   * Compara com outro CpfCnpj por valor
   */
  equals(other: CpfCnpj): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  /**
   * Retorna o valor formatado (123.456.789-09 ou 12.345.678/0001-90)
   */
  formatted(): string {
    if (this.isCpf()) {
      return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return this._value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  /**
   * Valida CPF usando algoritmo oficial
   *
   * @param cpf - CPF com 11 dígitos numéricos
   * @returns true se válido
   */
  private static validateCpf(cpf: string): boolean {
    // Rejeitar CPFs com todos os dígitos iguais
    if (cpf.split('').every((digit) => digit === cpf[0])) {
      return false;
    }

    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (firstDigit !== parseInt(cpf[9])) {
      return false;
    }

    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    return secondDigit === parseInt(cpf[10]);
  }

  /**
   * Valida CNPJ usando algoritmo oficial
   *
   * @param cnpj - CNPJ com 14 dígitos numéricos
   * @returns true se válido
   */
  private static validateCnpj(cnpj: string): boolean {
    // Rejeitar CNPJs com todos os dígitos iguais
    if (cnpj.split('').every((digit) => digit === cnpj[0])) {
      return false;
    }

    // Validar primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weights1[i];
    }
    let firstDigit = sum % 11;
    firstDigit = firstDigit < 2 ? 0 : 11 - firstDigit;

    if (firstDigit !== parseInt(cnpj[12])) {
      return false;
    }

    // Validar segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weights2[i];
    }
    let secondDigit = sum % 11;
    secondDigit = secondDigit < 2 ? 0 : 11 - secondDigit;

    return secondDigit === parseInt(cnpj[13]);
  }
}

/**
 * Exception para CPF/CNPJ inválido
 */
export class InvalidCpfCnpjException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCpfCnpjException';
  }
}
