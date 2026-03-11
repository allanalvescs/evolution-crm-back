/**
 * Value Object para Email
 *
 * Garante validação de formato RFC 5322 e imutabilidade.
 *
 * @example
 * ```typescript
 * const email = Email.create('usuario@exemplo.com');
 * ```
 */
export class Email {
  private constructor(private readonly _value: string) {}

  /**
   * Factory method para criar um Email válido
   *
   * @param value - Endereço de email
   * @returns Instância de Email
   * @throws {InvalidEmailException} Se o formato for inválido
   */
  static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new InvalidEmailException('Email não pode ser vazio');
    }

    const trimmedValue = value.trim().toLowerCase();

    if (!this.isValidFormat(trimmedValue)) {
      throw new InvalidEmailException('Formato de email inválido');
    }

    return new Email(trimmedValue);
  }

  /**
   * Retorna o valor do email em lowercase
   */
  get value(): string {
    return this._value;
  }

  /**
   * Retorna o domínio do email
   */
  get domain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Retorna a parte local do email (antes do @)
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Compara com outro Email por valor
   */
  equals(other: Email): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  /**
   * Valida formato de email (simplificado, compatível com RFC 5322)
   *
   * @param email - String para validar
   * @returns true se válido
   */
  private static isValidFormat(email: string): boolean {
    // Regex simplificado mas robusto para validação de email
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    // Validações adicionais
    const [localPart, domain] = email.split('@');

    // Local part não pode ter mais de 64 caracteres
    if (localPart.length > 64) {
      return false;
    }

    // Domínio não pode ter mais de 255 caracteres
    if (domain.length > 255) {
      return false;
    }

    // Cada parte do domínio não pode ter mais de 63 caracteres
    const domainParts = domain.split('.');
    if (domainParts.some((part) => part.length > 63)) {
      return false;
    }

    return true;
  }
}

/**
 * Exception para email inválido
 */
export class InvalidEmailException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailException';
  }
}
