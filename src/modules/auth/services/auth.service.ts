import { Injectable } from "@nestjs/common";
import { SignupCsDto } from "../dtos/signup/signup-cs.dto";
import { EUserRole } from "src/shared/enum/user-role.enum";
import { SigninCsDto } from "../dtos/signin/signin-cs.dto";
import { User } from "src/domain/entities/user/user";
import { UserRepository } from "src/domain/repositories/user.repository";
import { plainToInstance } from "class-transformer";
import { SigninScResponseDto } from "../dtos/signin/signin-sc.dto";
import { AuthValidator } from "src/applications/validator/auth/auth.validator";
import { UserValidator } from "src/applications/validator/user/user.validator";
import { v4 as uuidv4 } from "uuid";
import { EmailValueObject } from "src/domain/value-objetcts/email/email";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { TokenGenerator } from "src/domain/contracts/token-generator.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly userValidator: UserValidator,
  ) {}

  // async signin(body: SigninCsDto) {
  //     const { email, password } = body;

  //     const user = await this.authValidator.validate({ email, password });

  //     const accessToken = await this.generateToken(user);

  //     const result = plainToInstance(SigninScResponseDto, { accessToken }, { excludeExtraneousValues: true });

  //     return result;
  // }

  async signup(body: SignupCsDto) {
    await this.userValidator.existByEmail(body.email);

    const passwordHash = await this.passwordHasher.hash(body.password);

    const user = new User(
      uuidv4(),
      body.name,
      null,
      EmailValueObject.create(body.email),
      null,
      passwordHash,
      EUserRole.ADMIN,
    );

    await this.userRepository.create(user);

    return user;
  }

  // private generateToken(user: User) {
  //   const payload = {
  //     sub: user.getId(),
  //     email: user.getEmail(),
  //     role: user.getRole(),
  //   };

  //   return this.tokenGenerator.generate(payload);
  // }
}
