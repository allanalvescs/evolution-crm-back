import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { Company } from "src/domain/entities/company/company";
import { CompanyEntity } from "../persistence/entities/company.entity";
import { UserEntity } from "../persistence/entities/user.entity";
import { CompanyMapper } from "../persistence/mappers/company/company.mapper";

@Injectable()
export class MikroOrmCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    protected readonly orm: EntityRepository<CompanyEntity>,
    private readonly em: EntityManager,
  ) {}

  async create(company: Company): Promise<void> {
    const userRef = this.em.getReference(UserEntity, company.getUserId());
    const entity = CompanyMapper.toOrmEntity(company, userRef);

    this.em.persist(entity);

    await this.em.flush();
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const entity = await this.em.findOne(
      CompanyEntity,
      { cnpj },
      { populate: ["user"] },
    );
    return entity ? CompanyMapper.toDomainEntity(entity) : null;
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const entity = await this.em.findOne(
      CompanyEntity,
      { user: { id: userId } },
      { populate: ["user"] },
    );
    return entity ? CompanyMapper.toDomainEntity(entity) : null;
  }
}
