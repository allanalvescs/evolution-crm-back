import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SigninCsDto {
  @ApiProperty({
    description: "Email do usuário",
    example: "allan@gmail.com"
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Senha do usuário",
    example: "12345678"
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}