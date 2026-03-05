import { Injectable } from "@nestjs/common";
import { ClientCreateCsDto } from "../dtos/create/client-create-cs.dto";
import { CnpjService } from "src/shared/services/cnpj.service";
import { ClientCreateUseCase } from "src/applications/usecases/client/create/client-create.usecase";

@Injectable()
export class ClientService {
  constructor (
    private readonly cnpjService: CnpjService,
    private readonly clientCreateUsecase: ClientCreateUseCase
  ) {}

  async create({ data, userId }: { data: ClientCreateCsDto, userId: number }) {
    await this.cnpjService.consult(data.cpfCnpj);

    const client = await this.clientCreateUsecase.execute({
      client: {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        cpfCnpj: data.cpfCnpj,
        type: data.type,
        phone: data.phone,
      },
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        neighborhood: data.address.neighborhood,
        number: data.address.number,
        complement: data.address.complement,
      },
      userId,
    });

    return { client: { ...data, userId } };
  }
}