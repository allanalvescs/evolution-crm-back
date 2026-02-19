import { User } from "../entities/user";

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract update({ id ,user }: { user: User; id: number }): Promise<User>;
  abstract delete(id: number): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
}