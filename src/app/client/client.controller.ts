import { Body, Controller, Post } from "@nestjs/common";
import { ClientCreateCsDto } from "./dtos/create/client-create-cs.dto";
import { ExtractPayload, ExtractPayloadDto } from "src/shared/decorators/extractPayload";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

@Controller("clients")
export class ClientController {
  constructor() {}
  
  @ApiOperation({
    summary: 'Criação de cliente',
  })
  @Post()
  create(
    @Body() body: ClientCreateCsDto,
    @ExtractPayload() payload: ExtractPayloadDto
  ) {
    
  }
}