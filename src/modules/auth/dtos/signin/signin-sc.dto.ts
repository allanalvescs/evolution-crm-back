import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SigninScResponseDto {
  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token de autenticação'
  })
  accessToken: string;

}