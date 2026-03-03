import { User as UserDomain } from "src/domain/entities/user";
import { User } from "../../entities/user.entity";

export class UserMapper {
  static toDomainEntity(ormUser: User): UserDomain {
    const domainUser = new UserDomain();
    domainUser.id = ormUser.id;
    domainUser.name = ormUser.name;
    domainUser.email = ormUser.email;
    domainUser.password = ormUser.password;
    domainUser.role = ormUser.role;
    domainUser.surname = ormUser.surname || null;
    domainUser.tokenJwt = ormUser.tokenJwt || null;
    domainUser.avatarUrl = ormUser.avatarUrl || null;
    domainUser.dtLastLoginAt = ormUser.dtLastLoginAt || null;
    domainUser.dtCreatedAt = ormUser.dtCreatedAt || new Date();
    domainUser.dtUpdatedAt = ormUser.dtUpdatedAt || new Date();
    return domainUser;
  }

  static toOrmEntity(user: UserDomain): User {
    const orm = new User();

    orm.name = user.name;
    orm.email = user.email;
    orm.surname = user.surname || undefined;
    orm.password = user.password;
    orm.role = user.role;
    orm.tokenJwt = user.tokenJwt || undefined;
    orm.avatarUrl = user.avatarUrl || undefined;
    orm.dtLastLoginAt = user.dtLastLoginAt || undefined;

    return orm;
  }
}