import { Module } from "@nestjs/common";
import { UserValidator } from "./user/user.validator";
import { AuthValidator } from "./auth/auth.validator";

@Module({
  providers: [UserValidator, AuthValidator],
  exports: [UserValidator, AuthValidator]
})
export class ValidatorModule {}