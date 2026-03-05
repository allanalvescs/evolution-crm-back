import { EClientType } from "src/shared/enum/client-type";

export interface ClientCreateUseCaseInterface {
  userId: number;
  client: {
    name: string;
    companyName?: string;
    email: string;
    type: EClientType;
    cpfCnpj: string;
    phone?: string;
  };
  address: {
    street: string;
    neighborhood: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
    number: number;
  }
}