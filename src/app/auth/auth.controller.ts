import { Body, Controller, Post } from "@nestjs/common";
import { SignupCsDto } from "./dtos/signup-cs.dto";
import { AuthService } from "./services/auth.service";
import { SigninCsDto } from "./dtos/signin-cs.dto";
import { IsPublic } from "src/shared/decorators/isPublic";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @IsPublic()
  @Post("/signin")
  signin(@Body() signinCsDto: SigninCsDto) {
    return this.authService.signin(signinCsDto);
  }

  @IsPublic()
  @Post("/signup")
  signup(@Body() signupCsDto: SignupCsDto) {
    return this.authService.signup(signupCsDto);
  }
}