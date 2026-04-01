import { CompanyMapper } from "src/infrastructure/persistence/mappers/company/company.mapper";
import { CompanyEntity } from "src/infrastructure/persistence/entities/company.entity";
import { Company } from "src/domain/entities/company/company";
import { UserEntity } from "src/infrastructure/persistence/entities/user.entity";
import { EUserRole } from "src/domain/enums/user-role.enum";

const makeUserEntity = (): UserEntity => {
  const user = new UserEntity();
  user.id = "uuid-user-001";
  user.name = "Allan";
  user.email = "allan@example.com";
  user.password = "hashed";
  user.role = EUserRole.ADMIN;
  return user;
};

const makeCompanyEntity = (): CompanyEntity => {
  const entity = new CompanyEntity();
  entity.id = "uuid-company-001";
  entity.tradeName = "Minha Empresa";
  entity.companyName = "Minha Empresa LTDA";
  entity.cnpj = "11222333000181";
  entity.phone = undefined;
  entity.user = makeUserEntity();
  entity.dtCreatedAt = new Date("2026-01-01T00:00:00.000Z");
  entity.dtUpdatedAt = new Date("2026-01-02T00:00:00.000Z");
  return entity;
};

const makeCompanyDomain = (): Company =>
  Company.create({
    id: "uuid-company-001",
    tradeName: "Minha Empresa",
    companyName: "Minha Empresa LTDA",
    cnpj: "11222333000181",
    phone: null,
    userId: "uuid-user-001",
    dtCreatedAt: new Date("2026-01-01T00:00:00.000Z"),
  });

describe("CompanyMapper", () => {
  describe("toDomainEntity", () => {
    it("should map ORM entity to domain entity correctly", () => {
      const entity = makeCompanyEntity();
      const domain = CompanyMapper.toDomainEntity(entity);

      expect(domain).toBeInstanceOf(Company);
      expect(domain.getId()).toBe("uuid-company-001");
      expect(domain.getTradeName()).toBe("Minha Empresa");
      expect(domain.getCompanyName()).toBe("Minha Empresa LTDA");
      expect(domain.getCnpj()).toBe("11222333000181");
      expect(domain.getPhone()).toBeNull();
      expect(domain.getUserId()).toBe("uuid-user-001");
    });

    it("should map phone when present", () => {
      const entity = makeCompanyEntity();
      entity.phone = "(11) 98765-4321";

      const domain = CompanyMapper.toDomainEntity(entity);
      expect(domain.getPhone()).toBe("(11) 98765-4321");
    });
  });

  describe("toOrmEntity", () => {
    it("should map domain entity to ORM entity correctly", () => {
      const domain = makeCompanyDomain();
      const userRef = makeUserEntity();
      const entity = CompanyMapper.toOrmEntity(domain, userRef);

      expect(entity).toBeInstanceOf(CompanyEntity);
      expect(entity.id).toBe("uuid-company-001");
      expect(entity.tradeName).toBe("Minha Empresa");
      expect(entity.companyName).toBe("Minha Empresa LTDA");
      expect(entity.cnpj).toBe("11222333000181");
      expect(entity.phone).toBeUndefined();
      expect(entity.user.id).toBe("uuid-user-001");
    });

    it("should map phone when present", () => {
      const domain = Company.create({
        id: "uuid-company-001",
        tradeName: "Minha Empresa",
        companyName: "Minha Empresa LTDA",
        cnpj: "11222333000181",
        phone: "11987654321",
        userId: "uuid-user-001",
      });

      const entity = CompanyMapper.toOrmEntity(domain, makeUserEntity());
      expect(entity.phone).toBe("(11) 98765-4321");
    });
  });
});
