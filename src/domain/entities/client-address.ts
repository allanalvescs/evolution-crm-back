interface IClientAddress {
  id?: number;
  idClient: number;
  street: string;
  neighborhood: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date;
}

export class ClientAddress {
  id?: number;
  idClient: number;
  street: string;
  neighborhood: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date;

  assign(data: IClientAddress) {
    this.id = data.id || this.id;
    this.idClient = data.idClient || this.idClient;
    this.street = data.street || this.street;
    this.neighborhood = data.neighborhood || this.neighborhood;
    this.complement = data.complement || "";
    this.city = data.city || this.city;
    this.state = data.state || this.state;
    this.zipCode = data.zipCode || this.zipCode;
    this.country = data.country || this.country;
    this.dtCreatedAt = data.dtCreatedAt || this.dtCreatedAt;
    this.dtUpdatedAt = data.dtUpdatedAt || this.dtUpdatedAt;
  }

}