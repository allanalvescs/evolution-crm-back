import { Company } from "src/domain/entities/company/company";
import { CompanyRepository } from "src/domain/repositories/company.repository";

export class FakeCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];

  async create(company: Company): Promise<void> {
    this.companies.push(company);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return this.companies.find((c) => c.getCnpj() === cnpj) ?? null;
  }

  async findByUserId(userId: string): Promise<Company | null> {
    return this.companies.find((c) => c.getUserId() === userId) ?? null;
  }
}
