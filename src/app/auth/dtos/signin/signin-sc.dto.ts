import { ApiProperty } from "@nestjs/swagger";

export class SigninScResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token de autenticação'
  })
  accessToken: string;

}