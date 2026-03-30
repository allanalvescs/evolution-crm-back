import { Controller, Get } from "@nestjs/common";
import { ExtractPayload } from "src/shared/decorators/extract-payload.decorator";
import { UserService } from "./service/user.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @ApiBearerAuth()
  me(@ExtractPayload() payload: { id: string; email: string; role: string }) {
    return this.userService.me(payload);
  }
}
