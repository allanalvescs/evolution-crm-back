import { User } from "src/domain/entities/user/user";
import { UserRepository } from "src/domain/repositories/user.repository";
import { EUserRole } from "src/domain/enums/user-role.enum";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [
    User.create({
      id: "uuid",
      name: "Allan",
      surname: "",
      email: "allan@gmail.com",
      phone: null,
      password: "123456",
      role: EUserRole.ADMIN,
    }),
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
