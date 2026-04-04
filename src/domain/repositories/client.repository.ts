import { Client } from "../entities/client/client";

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByCpfAndCompanyId(
    cpf: string,
    companyId: string,
  ): Promise<Client | null>;
  abstract findByCnpjAndCompanyId(
    cnpj: string,
    companyId: string,
  ): Promise<Client | null>;
}
