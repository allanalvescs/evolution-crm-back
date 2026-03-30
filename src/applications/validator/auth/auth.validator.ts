import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/domain/repositories/user.repository";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { User } from "src/domain/entities/user/user";

@Injectable()
export class AuthValidator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async validate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    const isValidPassword = user
      ? await this.passwordHasher.compare(password, user.getPassword())
      : false;

    if (!user || !isValidPassword) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    return user;
  }
}
