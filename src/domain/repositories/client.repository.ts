import { Client } from "../entities/client/client";

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByCpf({
    cpf,
    companyId,
  }: {
    cpf: string;
    companyId?: string;
  }): Promise<Client | null>;
  abstract findByCnpj({
    cnpj,
    companyId,
  }: {
    cnpj: string;
    companyId?: string;
  }): Promise<Client | null>;
}
