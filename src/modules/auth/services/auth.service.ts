import { Injectable } from "@nestjs/common";
import { SignupCsDto } from "../dtos/signup/signup-cs.dto";
import { SigninCsDto } from "../dtos/signin/signin-cs.dto";
import { plainToInstance } from "class-transformer";
import { SigninScResponseDto } from "../dtos/signin/signin-sc.dto";
import { SignupScResponseDto } from "../dtos/signup/signup-sc.dto";
import { SignupUseCase } from "src/applications/usecases/auth/signup/signup.usecase";
import { SigninUseCase } from "src/applications/usecases/auth/signin/signin.usecase";

@Injectable()
export class AuthService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly signinUseCase: SigninUseCase,
  ) {}

  async signin(body: SigninCsDto): Promise<SigninScResponseDto> {
    const result = await this.signinUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return plainToInstance(SigninScResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async signup(body: SignupCsDto): Promise<SignupScResponseDto> {
    const user = await this.signupUseCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    const plain = {
      id: user.getId(),
      name: user.getName(),
      surname: user.getSurname(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    return plainToInstance(SignupScResponseDto, plain, {
      excludeExtraneousValues: true,
    });
  }
}
