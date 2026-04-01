import { Company } from "../entities/company/company";

export abstract class CompanyRepository {
  abstract create(company: Company): Promise<void>;
  abstract findByCnpj(cnpj: string): Promise<Company | null>;
  abstract findByUserId(userId: string): Promise<Company | null>;
}
