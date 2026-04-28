import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./service/company.service";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { CompanyValidator } from "src/applications/validator/company/company.validator";
import { MikroOrmCompanyRepository } from "src/infrastructure/repositories/companies.repository";
import { CompanyEntity } from "src/infrastructure/persistence/entities/company.entity";
import { UsecaseModule } from "src/applications/usecases/usecase.module";

@Module({
  imports: [UsecaseModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyValidator],
})
export class CompanyModule {}
