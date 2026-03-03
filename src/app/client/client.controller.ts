import { Body, Controller, Post } from "@nestjs/common";
import { ClientCreateCsDto } from "./dtos/create/client-create-cs.dto";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/activeUserId";
import { ClientService } from "./service/client.service";

@Controller("clients")
export class ClientController {
  constructor(
    private readonly clientService: ClientService
  ) {}
  
  @ApiOperation({
    summary: "Criação de cliente",
  })
  @Post()
  @ApiBearerAuth()
  create(
    @Body() body: ClientCreateCsDto,
    @ActiveUserId() userId: number
  ) {
    console.log("INIT controller")
    return this.clientService.create({ data: body, userId });
  }
}