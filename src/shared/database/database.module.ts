import { Global, Module } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([User])],
    providers: [],
    exports: [MikroOrmModule],
})
export class DatabaseModule {}