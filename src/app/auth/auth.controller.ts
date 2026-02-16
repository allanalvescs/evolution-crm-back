import { Body, Controller, Injectable, Post } from "@nestjs/common";
import { SignupCsDto } from "./dtos/signup-cs.dto";
import { AuthService } from "./services/auth.service";
import { SigninCsDto } from "./dtos/signin-cs.dto";

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("/signin")
  signin(@Body() signinCsDto: SigninCsDto) {
    return this.authService.signin(signinCsDto);
  }

  @Post("/signup")
  signup(@Body() signupCsDto: SignupCsDto) {
    return this.authService.signup(signupCsDto);
  }
}