import { Global, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { MikroOrmUserRepository } from "./persistence/repositories/users.repository";
import { UserEntity } from "./persistence/entities/user.entity";

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepository,
      useClass: MikroOrmUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class DatabaseModule {}
