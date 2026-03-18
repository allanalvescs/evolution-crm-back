/**
 * Value Object para Phone (Telefone Brasileiro)
 *
 * Suporta formatos brasileiros: celular (11 dígitos) e fixo (10 dígitos).
 * Garante validação e imutabilidade.
 *
 * @example
 * ```typescript
 * const celular = Phone.create('(11) 98765-4321');
 * const fixo = Phone.create('11 3456-7890');
 * ```
 */
export class Phone {
  private constructor(private readonly _value: string) {}

  /**
   * Factory method para criar um Phone válido
   *
   * @param value - Telefone com ou sem formatação
   * @returns Instância de Phone
   * @throws {InvalidPhoneException} Se o formato for inválido
   */
  static create(value: string): Phone {
    if (!value || typeof value !== 'string') {
      throw new InvalidPhoneException('Telefone não pode ser vazio');
    }

    const cleaned = value.replace(/\D/g, '');

    if (!this.isValidLength(cleaned)) {
      throw new InvalidPhoneException(
        'Telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)',
      );
    }

    if (!this.isValidFormat(cleaned)) {
      throw new InvalidPhoneException('Formato de telefone inválido');
    }

    return new Phone(cleaned);
  }

  /**
   * Retorna o valor sem formatação
   */
  get value(): string {
    return this._value;
  }

  /**
   * Retorna o DDD (código de área)
   */
  get ddd(): string {
    return this._value.substring(0, 2);
  }

  /**
   * Retorna o número sem DDD
   */
  get number(): string {
    return this._value.substring(2);
  }

  /**
   * Verifica se é celular (11 dígitos, começa com 9)
   */
  isCellphone(): boolean {
    return this._value.length === 11 && this._value[2] === '9';
  }

  /**
   * Verifica se é telefone fixo (10 dígitos)
   */
  isLandline(): boolean {
    return this._value.length === 10;
  }

  /**
   * Compara com outro Phone por valor
   */
  equals(other: Phone): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  /**
   * Retorna o valor formatado
   * Celular: (11) 98765-4321
   * Fixo: (11) 3456-7890
   */
  formatted(): string {
    if (this.isCellphone()) {
      return this._value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return this._value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  /**
   * Valida comprimento do telefone
   *
   * @param phone - Telefone apenas com números
   * @returns true se válido
   */
  private static isValidLength(phone: string): boolean {
    return phone.length === 10 || phone.length === 11;
  }

  /**
   * Valida formato do telefone brasileiro
   *
   * @param phone - Telefone apenas com números
   * @returns true se válido
   */
  private static isValidFormat(phone: string): boolean {
    // Validar DDD (11 a 99)
    const ddd = parseInt(phone.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      return false;
    }

    // Se for 11 dígitos (celular), o terceiro dígito deve ser 9
    if (phone.length === 11 && phone[2] !== '9') {
      return false;
    }

    // Se for 10 dígitos (fixo), o terceiro dígito não pode ser 9
    if (phone.length === 10 && phone[2] === '9') {
      return false;
    }

    // Validar se não são todos dígitos iguais
    if (phone.split('').every((digit) => digit === phone[0])) {
      return false;
    }

    return true;
  }
}

/**
 * Exception para telefone inválido
 */
export class InvalidPhoneException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPhoneException';
  }
}
