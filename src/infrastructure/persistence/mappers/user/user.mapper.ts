import { User } from "src/domain/entities/user/user";
import { UserEntity } from "../../entities/user.entity";

export class UserMapper {
  static toDomainEntity(entity: UserEntity): User {
    return User.create({
      id: entity.id,
      name: entity.name,
      surname: entity.surname || null,
      email: entity.email,
      phone: entity.phone ?? null,
      password: entity.password,
      role: entity.role,
    });
  }

  static toOrmEntity(user: User): UserEntity {
    const entity = new UserEntity();

    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail();
    entity.surname = user.getSurname() || undefined;
    entity.password = user.getPassword();
    entity.role = user.getRole();

    return entity;
  }
}
