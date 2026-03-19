import { User } from "src/domain/entities/user/user";
import { UserRepository } from "src/domain/repositories/user.repository";
import { EmailValueObject } from "src/domain/value-objetcts/email/email";
import { EUserRole } from "src/shared/enum/user-role.enum";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [
    new User(
      "uuid",
      "Allan",
      "",
      EmailValueObject.create("allan@gmail.com"),
      null,
      "123456",
      EUserRole.ADMIN,
    ),
  ];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.getEmail() === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.getId() === id) ?? null;
  }
}
