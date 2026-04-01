import { Injectable } from "@nestjs/common";
import { RegisterCompanyUseCase } from "src/applications/usecases/company/register-company/register-company.usecase";
import { RegisterCompanyCsDto } from "../dtos/register-company/register-company-cs.dto";
import { RegisterCompanyScDto } from "../dtos/register-company/register-company-sc.dto";

@Injectable()
export class CompanyService {
  constructor(
    private readonly registerCompanyUseCase: RegisterCompanyUseCase,
  ) {}

  async register(
    dto: RegisterCompanyCsDto,
    userId: string,
  ): Promise<RegisterCompanyScDto> {
    const company = await this.registerCompanyUseCase.execute({
      tradeName: dto.tradeName,
      companyName: dto.companyName,
      cnpj: dto.cnpj,
      phone: dto.phone,
      userId,
    });

    return {
      id: company.getId(),
      tradeName: company.getTradeName(),
      companyName: company.getCompanyName(),
      cnpj: company.getCnpj(),
      phone: company.getPhone(),
      userId: company.getUserId(),
      dtCreatedAt: company.getDtCreatedAt(),
    };
  }
}
