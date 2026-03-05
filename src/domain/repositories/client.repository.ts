import { Client } from "../entities/client";

export abstract class ClientRepository {
  abstract create(client: Client): Promise<Client>;
  abstract findByCpfCnpj(cpfCnpj: string): Promise<Client | null>;
  // abstract update({ id ,client }: { client: Client; id: number }): Promise<Client>;
  // abstract delete(id: number): Promise<void>;
  // abstract findById(id: number): Promise<Client | null>;
  // abstract getAll(userId: number): Promise<Client[]>;
}