import { Controller, Get } from "@nestjs/common";
import { ExtractPayload } from "src/shared/decorators/extractPayload";
import { UserService } from "./service/user.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @ApiBearerAuth('access-token')
  me(@ExtractPayload() payload) {
    return this.userService.me(payload);
  }
}