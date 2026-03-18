/**
 * Value Object para Address (Endereço Brasileiro)
 *
 * Representa um endereço completo com validação e imutabilidade.
 *
 * @example
 * ```typescript
 * const address = Address.create({
 *   street: 'Av. Paulista',
 *   number: '1000',
 *   neighborhood: 'Bela Vista',
 *   city: 'São Paulo',
 *   state: 'SP',
 *   zipCode: '01310-100',
 *   complement: 'Apto 101'
 * });
 * ```
 */
export interface AddressProps {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export class Address {
  private constructor(
    private readonly _street: string,
    private readonly _number: string,
    private readonly _neighborhood: string,
    private readonly _city: string,
    private readonly _state: string,
    private readonly _zipCode: string,
    private readonly _complement?: string,
  ) {}

  /**
   * Factory method para criar um Address válido
   *
   * @param props - Propriedades do endereço
   * @returns Instância de Address
   * @throws {InvalidAddressException} Se algum campo for inválido
   */
  static create(props: AddressProps): Address {
    this.validate(props);

    const cleanedZipCode = props.zipCode.replace(/\D/g, '');

    return new Address(
      props.street.trim(),
      props.number.trim(),
      props.neighborhood.trim(),
      props.city.trim(),
      props.state.trim().toUpperCase(),
      cleanedZipCode,
      props.complement?.trim(),
    );
  }

  /**
   * Retorna a rua
   */
  get street(): string {
    return this._street;
  }

  /**
   * Retorna o número
   */
  get number(): string {
    return this._number;
  }

  /**
   * Retorna o bairro
   */
  get neighborhood(): string {
    return this._neighborhood;
  }

  /**
   * Retorna a cidade
   */
  get city(): string {
    return this._city;
  }

  /**
   * Retorna o estado (UF)
   */
  get state(): string {
    return this._state;
  }

  /**
   * Retorna o CEP sem formatação
   */
  get zipCode(): string {
    return this._zipCode;
  }

  /**
   * Retorna o complemento (opcional)
   */
  get complement(): string | undefined {
    return this._complement;
  }

  /**
   * Retorna o CEP formatado (12345-678)
   */
  get formattedZipCode(): string {
    return this._zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Compara com outro Address por valor
   */
  equals(other: Address): boolean {
    if (!other) return false;

    return (
      this._street === other._street &&
      this._number === other._number &&
      this._neighborhood === other._neighborhood &&
      this._city === other._city &&
      this._state === other._state &&
      this._zipCode === other._zipCode &&
      this._complement === other._complement
    );
  }

  /**
   * Retorna endereço formatado como string
   */
  toString(): string {
    const parts = [
      `${this._street}, ${this._number}`,
      this._complement,
      this._neighborhood,
      `${this._city} - ${this._state}`,
      this.formattedZipCode,
    ];

    return parts.filter(Boolean).join(', ');
  }

  /**
   * Valida as propriedades do endereço
   *
   * @param props - Propriedades a validar
   * @throws {InvalidAddressException} Se alguma propriedade for inválida
   */
  private static validate(props: AddressProps): void {
    if (!props.street || props.street.trim().length === 0) {
      throw new InvalidAddressException('Rua é obrigatória');
    }

    if (!props.number || props.number.trim().length === 0) {
      throw new InvalidAddressException('Número é obrigatório');
    }

    if (!props.neighborhood || props.neighborhood.trim().length === 0) {
      throw new InvalidAddressException('Bairro é obrigatório');
    }

    if (!props.city || props.city.trim().length === 0) {
      throw new InvalidAddressException('Cidade é obrigatória');
    }

    if (!props.state || props.state.trim().length === 0) {
      throw new InvalidAddressException('Estado é obrigatório');
    }

    // Validar UF (2 caracteres)
    const state = props.state.trim().toUpperCase();
    if (state.length !== 2 || !/^[A-Z]{2}$/.test(state)) {
      throw new InvalidAddressException(
        'Estado deve ser uma UF válida (ex: SP, RJ)',
      );
    }

    // Validar lista de UFs brasileiras
    const validStates = [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ];

    if (!validStates.includes(state)) {
      throw new InvalidAddressException(`Estado inválido: ${state}`);
    }

    // Validar CEP (8 dígitos)
    if (!props.zipCode) {
      throw new InvalidAddressException('CEP é obrigatório');
    }

    const cleanedZipCode = props.zipCode.replace(/\D/g, '');
    if (cleanedZipCode.length !== 8) {
      throw new InvalidAddressException('CEP deve ter 8 dígitos');
    }

    if (!/^\d{8}$/.test(cleanedZipCode)) {
      throw new InvalidAddressException('CEP deve conter apenas números');
    }
  }
}

/**
 * Exception para endereço inválido
 */
export class InvalidAddressException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAddressException';
  }
}
