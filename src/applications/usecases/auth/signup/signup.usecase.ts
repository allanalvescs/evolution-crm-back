import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserValidator } from "src/applications/validator/user/user.validator";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { User } from "src/domain/entities/user/user";
import { EmailValueObject } from "src/domain/value-objects/email/email";
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

    const user = new User(
      uuidv4(),
      data.name,
      data.surname ?? null,
      data.email,
      null,
      passwordHash,
      EUserRole.ADMIN,
    );

    await this.userRepository.create(user);

    return user;
  }
}
