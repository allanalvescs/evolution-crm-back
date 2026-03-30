import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserValidator } from "src/applications/validator/user/user.validator";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";
import { SignupUseCaseInterface } from "./signup-interface.usecase";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidator: UserValidator,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(data: SignupUseCaseInterface): Promise<User> {
    await this.userValidator.existByEmail(data.email);

    const passwordHash = await this.passwordHasher.hash(data.password);

    const user = User.create({
      id: uuidv4(),
      name: data.name,
      surname: data.surname ?? null,
      email: data.email,
      phone: null,
      password: passwordHash,
      role: EUserRole.ADMIN,
    });

    await this.userRepository.create(user);

    return user;
  }
}
