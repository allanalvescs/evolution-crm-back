import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { CompanyValidator } from "src/applications/validator/company/company.validator";
import { Company } from "src/domain/entities/company/company";
import { RegisterCompanyUseCaseInterface } from "./register-company-interface.usecase";

@Injectable()
export class RegisterCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly companyValidator: CompanyValidator,
  ) {}

  async execute(data: RegisterCompanyUseCaseInterface): Promise<Company> {
    await this.companyValidator.existByCnpj(data.cnpj);
    await this.companyValidator.existByUserId(data.userId);

    const company = Company.create({
      id: uuidv4(),
      tradeName: data.tradeName,
      companyName: data.companyName,
      cnpj: data.cnpj,
      phone: data.phone ?? null,
      userId: data.userId,
    });

    await this.companyRepository.create(company);

    return company;
  }
}
