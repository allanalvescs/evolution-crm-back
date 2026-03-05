import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./service/client.service";
import { UsecaseModule } from "src/applications/usecases/usecase.module";
import { HttpModule } from "@nestjs/axios";
import { CnpjService } from "src/shared/services/cnpj.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      
    }),
    UsecaseModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, CnpjService]
})
export class ClientModule {}