import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class RegisterCompanyCsDto {
  @ApiProperty({
    description: "Nome fantasia da empresa",
    example: "Minha Empresa",
  })
  @IsString()
  @IsNotEmpty()
  tradeName!: string;

  @ApiProperty({
    description: "Razão Social da empresa",
    example: "Minha Empresa LTDA",
  })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({
    description: "CNPJ da empresa (somente dígitos ou formatado)",
    example: "11222333000181",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, {
    message:
      "CNPJ inválido. Informe 14 dígitos numéricos ou no formato XX.XXX.XXX/XXXX-XX",
  })
  cnpj!: string;

  @ApiProperty({
    description: "Telefone de contato (opcional)",
    example: "11987654321",
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
