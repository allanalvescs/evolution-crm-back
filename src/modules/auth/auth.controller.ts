import { Body, Controller, Post } from "@nestjs/common";
import { SignupCsDto } from "./dtos/signup/signup-cs.dto";
import { AuthService } from "./services/auth.service";
import { SigninCsDto } from "./dtos/signin/signin-cs.dto";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { SigninScResponseDto } from "./dtos/signin/signin-sc.dto";
import { SignupScResponseDto } from "./dtos/signup/signup-sc.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Login do usuário',
  })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso',
    type: SigninScResponseDto
  })
  @IsPublic()
  @Post("/signin")
  signin(@Body() signinCsDto: SigninCsDto) {
    return this.authService.signin(signinCsDto);
  }

  @ApiOperation({
    summary: 'Cadastro de novo usuário',
  })
  @ApiCreatedResponse({
    type: SignupScResponseDto,
  })
  @IsPublic()
  @Post("/signup")
  signup(@Body() signupCsDto: SignupCsDto) {
    return this.authService.signup(signupCsDto);
  }
}