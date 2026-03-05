import { Module } from "@nestjs/common";
import { UserValidator } from "./user/user.validator";
import { AuthValidator } from "./auth/auth.validator";
import { ClientValidator } from "./client/client.validator";

@Module({
  providers: [UserValidator, AuthValidator, ClientValidator],
  exports: [UserValidator, AuthValidator, ClientValidator]
})
export class ValidatorModule {}