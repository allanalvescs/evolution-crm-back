import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { EClientType } from "src/shared/enum/client-type";

export class ClientCreateScResponseDto {
  @Expose()
  @ApiProperty({
    description: "Nome do cliente",
    example: "João da Silva",
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Razão social ou nome da empresa",
    example: "Empresa XYZ LTDA",
    nullable: true,
    required: false,
  })
  companyName?: string;

  @Expose()
  @ApiProperty({
    description: "Email do cliente",
    example: "joao.silva@email.com",
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: "Tipo de cliente",
    enum: EClientType,
    example: EClientType.PF,
  })
  type: EClientType;

  @Expose()
  @ApiProperty({
    description: "CPF ou CNPJ com apenas dígitos",
    example: "12345678901",
  })
  cpfCnpj: string;

  @Expose()
  @ApiProperty({
    description: "Telefone do cliente",
    example: "11999999999",
    nullable: true,
    required: false,
  })
  phone?: string;

  @Expose()
  @ApiProperty({
    description: "ID do usuário dono do cliente",
    example: 1,
  })
  userId: number;
}
