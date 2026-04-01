import { Company } from "src/domain/entities/company/company";
import { CompanyEntity } from "../../entities/company.entity";
import { UserEntity } from "../../entities/user.entity";

export class CompanyMapper {
  static toDomainEntity(entity: CompanyEntity): Company {
    return Company.create({
      id: entity.id,
      tradeName: entity.tradeName,
      companyName: entity.companyName,
      cnpj: entity.cnpj,
      phone: entity.phone ?? null,
      userId: entity.user.id,
      dtCreatedAt: entity.dtCreatedAt,
      dtUpdatedAt: entity.dtUpdatedAt ?? null,
    });
  }

  static toOrmEntity(company: Company): CompanyEntity {
    const entity = new CompanyEntity();

    entity.id = company.getId();
    entity.tradeName = company.getTradeName();
    entity.companyName = company.getCompanyName();
    entity.cnpj = company.getCnpj();
    entity.phone = company.getPhone() ?? undefined;
    const userRef = new UserEntity();
    userRef.id = company.getUserId();
    entity.user = userRef;

    return entity;
  }
}
