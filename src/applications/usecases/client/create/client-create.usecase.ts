import { Injectable } from "@nestjs/common";
import { ClientRepository } from "src/domain/repositories/client.repository";
import { ClientCreateUseCaseInterface } from "./client-create-interface.usecase";
import { ClientValidator } from "src/applications/validator/client/client.validator";

@Injectable()
export class ClientCreateUseCase {
  constructor(
    private readonly clientValidator: ClientValidator,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute({ userId, client, address }: ClientCreateUseCaseInterface) {
    await this.clientValidator.existBycpfCnpj(client.cpfCnpj);

    
  }
}