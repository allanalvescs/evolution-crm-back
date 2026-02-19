import { Injectable } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserMapper } from "src/shared/database/mappers/user.mapper";

import { User as UserDomain } from "src/domain/entities/user";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User) protected readonly orm: EntityRepository<User>,
    private readonly em: EntityManager
  ) {}

  async create(user: UserDomain): Promise<UserDomain> {
    const entity = UserMapper.toOrmEntity(user);
    
    this.em.persist(entity);
    
    await this.em.flush();

    return UserMapper.toDomainEntity(entity);
  }

  async delete(id: number): Promise<void> {
    await this.em.nativeDelete(User, { id });
  }

  async update({ id, user }: { user: UserDomain; id: number }): Promise<UserDomain> {
    const entity = UserMapper.toOrmEntity(user);
    
    this.em.assign(
      await this.em.findOneOrFail(User, { id, }),
      entity,
    );

    await this.em.flush();

    return UserMapper.toDomainEntity(entity);
  }

  async findByEmail (email: string): Promise<UserDomain | null> {
    const entity = await this.em.findOne(User, { email });
    return entity ? UserMapper.toDomainEntity(entity) : null;
  }

  async findById(id: number): Promise<UserDomain | null> {
    const entity = await this.em.findOne(User, { id });
    return entity ? UserMapper.toDomainEntity(entity) : null;
  }
}