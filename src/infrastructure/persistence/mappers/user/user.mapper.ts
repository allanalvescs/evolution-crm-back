import { User } from "src/domain/entities/user/user";
import { UserEntity } from "../../entities/user.entity";
import { EmailValueObject } from "src/domain/value-objetcts/email/email";
import { PhoneValueObject } from "src/domain/value-objetcts/phone/phone";

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const email = EmailValueObject.create(entity.email);
    const phone = entity.phone ? PhoneValueObject.create(entity.phone) : null;
    const role = entity.role as User["role"];
    
    return new User(
      entity.id,
      entity.name,
      entity.surname || null,
      email,
      phone,
      entity.password,
      role,
    );
  }

  static toPersistence(user: User): UserEntity {
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