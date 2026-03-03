import { EClientType } from "src/shared/enum/client-type";
import { EStatus } from "src/shared/enum/generic-status";

interface IClient {
  id?: number;
  idUser: number;
  name: string;
  companyName?: string;
  email: string;
  type: EClientType;
  cpfCnpj: string;
  status: EStatus;
  phone?: string;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date;
}

export class Client {
  id?: number;
  idUser: number;
  name: string;
  companyName?: string;
  email: string;
  type: EClientType;
  cpfCnpj: string;
  status: EStatus;
  phone?: string;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date;
  
  assign(data: IClient) {
    this.id = data.id || this.id;
    this.idUser = data.idUser || this.idUser;
    this.name = data.name || this.name;
    this.companyName = data.companyName || this.companyName;
    this.email = data.email || this.email;
    this.type = data.type || this.type;
    this.cpfCnpj = data.cpfCnpj || this.cpfCnpj;
    this.status = data.status || this.status;
    this.phone = data.phone || this.phone;
    this.dtCreatedAt = data.dtCreatedAt || this.dtCreatedAt;
    this.dtUpdatedAt = data.dtUpdatedAt || this.dtUpdatedAt;
  }
}