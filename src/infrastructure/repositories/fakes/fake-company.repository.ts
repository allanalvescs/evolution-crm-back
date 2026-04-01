import { Company } from "src/domain/entities/company/company";
import { CompanyRepository } from "src/domain/repositories/company.repository";

export class FakeCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];

  create(company: Company): Promise<void> {
    this.companies.push(company);
    return Promise.resolve();
  }

  findByCnpj(cnpj: string): Promise<Company | null> {
    return Promise.resolve(
      this.companies.find((c) => c.getCnpj() === cnpj) ?? null,
    );
  }

  findByUserId(userId: string): Promise<Company | null> {
    return Promise.resolve(
      this.companies.find((c) => c.getUserId() === userId) ?? null,
    );
  }
}
