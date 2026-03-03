import { Injectable } from "@nestjs/common";
import { ClientCreateCsDto } from "../dtos/create/client-create-cs.dto";

@Injectable()
export class ClientService {
  constructor () {}

  async create({ data, userId }: { data: ClientCreateCsDto, userId: number }) {
    return { client: { ...data, userId } };
  }
}