import { Module } from "@nestjs/common";
import { SignupUseCase } from "./auth/signup/signup.usecase";
import { SigninUseCase } from "./auth/signin/signin.usecase";
import { RegisterCompanyUseCase } from "./company/register-company/register-company.usecase";
import { ValidatorModule } from "../validator/validator.module";
import { TokenGenerator } from "src/domain/contracts/token-generator.interface";
import { JwtTokenGenerator } from "src/infrastructure/services/jwt-token-generator";

@Module({
  imports: [ValidatorModule],
  providers: [
    SignupUseCase,
    SigninUseCase,
    RegisterCompanyUseCase,
    { provide: TokenGenerator, useClass: JwtTokenGenerator },
  ],
  exports: [SignupUseCase, SigninUseCase, RegisterCompanyUseCase],
})
export class UsecaseModule {}
