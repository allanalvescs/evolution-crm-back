import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { EUserRole } from "src/shared/enum/user-role.enum";

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(
    @InjectRepository(User) private readonly orm: EntityRepository<User>,
    protected readonly em: EntityManager
  ) {
    super(orm.getEntityManager(), User);
  }

  async save(data: {  name: string; email: string; password: string; role: EUserRole }) {
    const user = this.em.create(User, {
      name: data.name,
      email: data.email,
      surname: undefined,
      password: data.password,
      role: data.role || EUserRole.ADMIN
    });

    this.em.persist(user);

    this.em.flush();

    return user;
  }

  async findByEmail (email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }
}