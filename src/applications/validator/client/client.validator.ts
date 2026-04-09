import { ConflictException, Injectable } from "@nestjs/common";
import { ClientRepository } from "src/domain/repositories/client.repository";

@Injectable()
export class ClientValidator {
  constructor(private readonly clientRepository: ClientRepository) {}

  async existByCpf(cpf: string, companyId: string): Promise<void> {
    const client = await this.clientRepository.findByCpf({ cpf, companyId });
    if (client) {
      throw new ConflictException("Já existe um cliente com esse CPF");
    }
  }

  async existByCnpj(cnpj: string, companyId: string): Promise<void> {
    const client = await this.clientRepository.findByCnpj({ cnpj, companyId });
    if (client) {
      throw new ConflictException("Já existe um cliente com esse CNPJ");
    }
  }
}
