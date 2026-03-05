import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientRepository } from "src/domain/repositories/client.repository";

@Injectable()
export class ClientValidator {
  constructor(private readonly clientRepository: ClientRepository) {}

  async existBycpfCnpj(cpfCnpj: string) {
    const client = await this.clientRepository.findByCpfCnpj(cpfCnpj);

    if (client) {
      throw new BadRequestException("Já existe um cliente cadastrado com este CPF/CNPJ");
    }

  }
}