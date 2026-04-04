const VALID_UF = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export type AddressProps = {
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
};

export class AddressValueObject {
  readonly cep: string;
  readonly street: string;
  readonly neighborhood: string;
  readonly number: string;
  readonly complement: string | null;
  readonly city: string;
  readonly state: string;

  private constructor(props: AddressProps) {
    AddressValueObject.validate(props);
    this.cep = props.cep;
    this.street = props.street;
    this.neighborhood = props.neighborhood;
    this.number = props.number;
    this.complement = props.complement;
    this.city = props.city;
    this.state = props.state;
  }

  static create(props: AddressProps): AddressValueObject {
    return new AddressValueObject(props);
  }

  getCep(): string {
    return this.cep;
  }
  getStreet(): string {
    return this.street;
  }
  getNeighborhood(): string {
    return this.neighborhood;
  }
  getNumber(): string {
    return this.number;
  }
  getComplement(): string | null {
    return this.complement;
  }
  getCity(): string {
    return this.city;
  }
  getState(): string {
    return this.state;
  }

  private static validate(props: AddressProps): void {
    if (!props.cep) throw new Error("CEP é obrigatório");
    if (!/^\d{8}$/.test(props.cep)) throw new Error("CEP inválido");
    if (!props.street) throw new Error("Rua é obrigatória");
    if (!props.neighborhood) throw new Error("Bairro é obrigatório");
    if (!props.number) throw new Error("Número é obrigatório");
    if (!props.city) throw new Error("Cidade é obrigatória");
    if (!props.state) throw new Error("Estado é obrigatório");
    if (!VALID_UF.includes(props.state)) throw new Error("Estado inválido");
  }
}
