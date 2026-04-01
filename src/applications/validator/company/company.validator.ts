import { ConflictException, Injectable } from "@nestjs/common";
import { CompanyRepository } from "src/domain/repositories/company.repository";

@Injectable()
export class CompanyValidator {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async existByCnpj(cnpj: string): Promise<void> {
    const company = await this.companyRepository.findByCnpj(cnpj);
    if (company) {
      throw new ConflictException("Já existe uma empresa com esse CNPJ");
    }
  }

  async existByUserId(userId: string): Promise<void> {
    const company = await this.companyRepository.findByUserId(userId);
    if (company) {
      throw new ConflictException("Usuário já possui uma empresa cadastrada");
    }
  }
}
