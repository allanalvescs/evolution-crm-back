import { Global, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { MikroOrmUserRepository } from "./repositories/users.repository";
import { User } from "src/infrastructure/entities/user.entity";
import { Client } from "../entities/client.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([
        User,
        Client
    ])],
    providers: [
        {
            provide: UserRepository,
            useClass: MikroOrmUserRepository,
        }
    ],
    exports: [UserRepository],
})
export class DatabaseModule {}