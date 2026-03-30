import { Module } from "@nestjs/common";
import { UserValidator } from "./user/user.validator";
import { AuthValidator } from "./auth/auth.validator";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { BcryptPasswordHasher } from "src/infrastructure/services/bcrypt-password-hasher.service";

@Module({
  providers: [
    UserValidator,
    AuthValidator,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
  ],
  exports: [UserValidator, AuthValidator, PasswordHasher],
})
export class ValidatorModule {}
