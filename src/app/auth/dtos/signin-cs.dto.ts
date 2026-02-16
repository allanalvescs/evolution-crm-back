import { IsNotEmpty, IsString } from "class-validator";

export class SigninCsDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}