import { Injectable } from "@nestjs/common";
import { SignupCsDto } from "../dtos/signup-cs.dto";
import { UserRepository } from "src/shared/database/repositories/users.repository";
import { hash } from "bcryptjs";
import { EUserRole } from "src/shared/enum/user-role.enum";
import { UserValidator } from "src/shared/validator/user/user.validator";
import { SigninCsDto } from "../dtos/signin-cs.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/shared/entities/user.entity";
import { AuthValidator } from "src/shared/validator/auth/auth.validator";

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

      return { accessToken };

  }

  async signup(body: SignupCsDto) {
    const { name, email, password } = body;

    await this.userValidator.existByEmail(email);

    const passwordHash = await hash(password, 12);

    const newUser = await this.userRepository.save({
      name,
      email,
      password: passwordHash,
      role: EUserRole.ADMIN
    } as any);


    return newUser;
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