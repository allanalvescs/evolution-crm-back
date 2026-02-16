import { Global, Module } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "./repositories/users.repository";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([User])],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class DatabaseModule {}