import { Injectable } from "@nestjs/common";
import { SignupCsDto } from "../dtos/signup/signup-cs.dto";
import { hash } from "bcryptjs";
import { EUserRole } from "src/shared/enum/user-role.enum";
import { UserValidator } from "src/shared/validator/user/user.validator";
import { SigninCsDto } from "../dtos/signin/signin-cs.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/domain/entities/user";
import { AuthValidator } from "src/shared/validator/auth/auth.validator";
import { UserRepository } from "src/domain/repositories/user.repository";
import { plainToInstance } from "class-transformer";
import { SigninScResponseDto } from "../dtos/signin/signin-sc.dto";
import { SignupScResponseDto } from "../dtos/signup/signup-sc.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userValidator: UserValidator,
    private readonly authValidator: AuthValidator,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signin(body: SigninCsDto) {
      const { email, password } = body;

      const user = await this.authValidator.validate({ email, password });

      const accessToken = await this.generateToken(user);

      const result = plainToInstance(SigninScResponseDto, { accessToken }, { excludeExtraneousValues: true });

      return result;
  }

  async signup(body: SignupCsDto) {
    const { name, email, password } = body;

    await this.userValidator.existByEmail(email);

    const passwordHash = await hash(password, 12);

    const user = new User();
    user.assign({
      name,
      email,
      password: passwordHash,
      role: EUserRole.ADMIN
    });

    const newUser = await this.userRepository.create(user);

    const result = plainToInstance(SignupScResponseDto, newUser, { excludeExtraneousValues: true });

    return result;
  }

  private generateToken(user: User) {
    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role 
    };

    return this.jwtService.signAsync(payload);
  }
}