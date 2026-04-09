import { Global, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { MikroOrmUserRepository } from "./persistence/repositories/users.repository";
import { UserEntity } from "./persistence/entities/user.entity";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { MikroOrmCompanyRepository } from "./repositories/companies.repository";
import { CompanyEntity } from "./persistence/entities/company.entity";
import { ClientRepository } from "src/domain/repositories/client.repository";

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, CompanyEntity])],
  providers: [
    {
      provide: UserRepository,
      useClass: MikroOrmUserRepository,
    },
    {
      provide: CompanyRepository,
      useClass: MikroOrmCompanyRepository,
    },
    {
      provide: ClientRepository,
      useClass: MikroOrmClientRepository,
    },
  ],
  exports: [UserRepository, CompanyRepository, ClientRepository],
})
export class DatabaseModule {}
