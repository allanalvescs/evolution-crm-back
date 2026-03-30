import { Injectable } from "@nestjs/common";
import { AuthValidator } from "src/applications/validator/auth/auth.validator";
import { TokenGenerator } from "src/domain/contracts/token-generator.interface";
import {
  SigninUseCaseInterface,
  SigninUseCaseResult,
} from "./signin-interface.usecase";

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: SigninUseCaseInterface): Promise<SigninUseCaseResult> {
    const user = await this.authValidator.validate({ email, password });

    const accessToken = await this.tokenGenerator.generate({
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    });

    return { accessToken };
  }
}
