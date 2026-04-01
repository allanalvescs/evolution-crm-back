import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { ExtractPayload } from "src/shared/decorators/extract-payload.decorator";
import { CompanyService } from "./service/company.service";
import { RegisterCompanyCsDto } from "./dtos/register-company/register-company-cs.dto";
import { RegisterCompanyScDto } from "./dtos/register-company/register-company-sc.dto";

@ApiBearerAuth()
@Controller("companies")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: "Cadastro da empresa do usuário autenticado" })
  @ApiCreatedResponse({ type: RegisterCompanyScDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() dto: RegisterCompanyCsDto,
    @ExtractPayload() payload: { id: string; email: string; role: string },
  ): Promise<RegisterCompanyScDto> {
    return this.companyService.register(dto, payload.id);
  }
}
