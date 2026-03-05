import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ClientCreateScResponseDto } from "../dtos/create/client-create-sc.dto";

@Injectable()
export class ClientCreateFactory {
  make(data: ClientCreateScResponseDto) {
    const result = plainToInstance(ClientCreateScResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return { data: result };
  }
}
