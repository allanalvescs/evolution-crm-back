import { Body, Controller, Post } from "@nestjs/common";
import { ClientCreateCsDto } from "./dtos/create/client-create-cs.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/active-user-id.decorator";
import { ClientService } from "./service/client.service";
import { ClientCreateScResponseDto } from "./dtos/create/client-create-sc.dto";

@Controller("clients")
export class ClientController {
  constructor(
    private readonly clientService: ClientService
  ) {}
  
  @ApiOperation({
    summary: "Criação de cliente",
  })
  @ApiCreatedResponse({
    type: ClientCreateScResponseDto,
  })
  @Post()
  @ApiBearerAuth()
  create(
    @Body() body: ClientCreateCsDto,
    @ActiveUserId() userId: number
  ) {
    return this.clientService.create({ data: body, userId });
  }
}