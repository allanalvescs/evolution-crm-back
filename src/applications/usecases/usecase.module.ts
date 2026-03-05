import { Module } from "@nestjs/common";
import { ClientCreateUseCase } from "./client/create/client-create.usecase";
import { ValidatorModule } from "../validator/validator.module";

@Module({
  imports: [ValidatorModule],
  providers: [ClientCreateUseCase],
  exports: [ClientCreateUseCase]
})
export class UsecaseModule {}