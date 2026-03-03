import { IsString, IsEmail, IsEnum, IsOptional, IsNumberString } from "class-validator";
import { Transform } from "class-transformer";
import { EClientType } from "src/shared/enum/client-type";
import { EStatus } from "src/shared/enum/generic-status";
import { ApiProperty } from "@nestjs/swagger";

export class ClientCreateCsDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da Silva',
  })
  @IsString({ message: "name deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Razão social ou nome da empresa',
    example: 'Empresa XYZ LTDA',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "companyName deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  companyName?: string;

  @ApiProperty({
    description: 'Endereço de email do cliente',
    example: 'joao.silva@email.com',
  })
  @IsEmail({}, { message: "email deve ser um endereço de email válido" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Tipo de cliente: PF (Pessoa Física) ou PJ (Pessoa Jurídica)',
    enum: EClientType,
    example: EClientType.PF,
  })
  @IsEnum(EClientType, { message: "type deve ser um dos valores: PF ou PJ" })
  type: EClientType;

  @ApiProperty({
    description: 'CPF (para PF) ou CNPJ (para PJ) - apenas dígitos',
    example: '12345678901234',
  })
  @IsString({ message: "cpfCnpj deve ser uma string" })
  @IsNumberString({}, { message: "cpfCnpj deve conter apenas números" })
  @Transform(({ value }) => value?.replace(/\D/g, ""))
  cpfCnpj: string;

  @ApiProperty({
    description: 'Telefone do cliente - apenas dígitos',
    example: '1199999999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "phone deve ser uma string" })
  @Transform(({ value }) => value?.replace(/\D/g, ""))
  phone?: string;
}