import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../persistence/entities/user.entity";
import { UserRepository } from "src/domain/repositories/user.repository";

import { User as UserDomain } from "src/domain/entities/user/user";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UserMapper } from "../../persistence/mappers/user/user.mapper";

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly orm: EntityRepository<UserEntity>,
    private readonly em: EntityManager,
  ) {}

  async create(user: UserDomain): Promise<void> {
    const entity = UserMapper.toOrmEntity(user);

    this.em.persist(entity);

    await this.em.flush();
  }

  async findByEmail(email: string): Promise<UserDomain | null> {
    const entity = await this.em.findOne(UserEntity, { email });
    return entity ? UserMapper.toDomainEntity(entity) : null;
  }

  async findById(id: string): Promise<UserDomain | null> {
    const entity = await this.em.findOne(UserEntity, { id });
    return entity ? UserMapper.toDomainEntity(entity) : null;
  }
}
