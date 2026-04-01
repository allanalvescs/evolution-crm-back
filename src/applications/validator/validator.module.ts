import { Module } from "@nestjs/common";
import { UserValidator } from "./user/user.validator";
import { AuthValidator } from "./auth/auth.validator";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { BcryptPasswordHasher } from "src/infrastructure/services/bcrypt-password-hasher.service";
import { CompanyValidator } from "./company/company.validator";

@Module({
  providers: [
    UserValidator,
    AuthValidator,
    CompanyValidator,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
  ],
  exports: [UserValidator, AuthValidator, CompanyValidator, PasswordHasher],
})
export class ValidatorModule {}
