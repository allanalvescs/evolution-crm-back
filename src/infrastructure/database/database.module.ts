import { Global, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { MikroOrmUserRepository } from "./repositories/users.repository";
import { User } from "src/infrastructure/entities/user.entity";
import { Client } from "../entities/client.entity";
import { ClientAddress } from "../entities/client-address.entity";
import { ClientRepository } from "src/domain/repositories/client.repository";
import { MikroOrmClientRepository } from "./repositories/client.repository";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([
        User,
        Client,
        ClientAddress
    ])],
    providers: [
        {
            provide: UserRepository,
            useClass: MikroOrmUserRepository,
        },
        {
            provide: ClientRepository,
            useClass: MikroOrmClientRepository,
        }
    ],
    exports: [UserRepository, ClientRepository],
})
export class DatabaseModule {}