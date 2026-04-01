import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class RegisterCompanyScDto {
  @Expose()
  @ApiProperty({ description: "ID da empresa", example: "uuid" })
  id!: string;

  @Expose()
  @ApiProperty({ description: "Nome fantasia", example: "Minha Empresa" })
  tradeName!: string;

  @Expose()
  @ApiProperty({ description: "Razão Social", example: "Minha Empresa LTDA" })
  companyName!: string;

  @Expose()
  @ApiProperty({ description: "CNPJ", example: "11222333000181" })
  cnpj!: string;

  @Expose()
  @ApiProperty({
    description: "Telefone",
    example: "(11) 98765-4321",
    nullable: true,
  })
  phone!: string | null;

  @Expose()
  @ApiProperty({
    description: "ID do usuário proprietário",
    example: "uuid-user",
  })
  userId!: string;

  @Expose()
  @ApiProperty({
    description: "Data de criação",
    example: "2026-04-01T00:00:00.000Z",
  })
  dtCreatedAt!: Date;
}
