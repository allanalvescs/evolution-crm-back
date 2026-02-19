import { Global, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { MikroOrmUserRepository } from "./repositories/users.repository";
import { User } from "src/shared/entities/user.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([User])],
    providers: [
        {
            provide: UserRepository,
            useClass: MikroOrmUserRepository,
        }
    ],
    exports: [UserRepository],
})
export class DatabaseModule {}