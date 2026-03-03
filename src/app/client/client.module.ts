import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./service/client.service";

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}