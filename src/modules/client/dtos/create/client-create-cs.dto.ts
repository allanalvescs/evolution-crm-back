import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNumberString,
  IsInt,
} from "class-validator";
import { Transform } from "class-transformer";
import { EClientType } from "src/shared/enum/client-type";
import { ApiProperty } from "@nestjs/swagger";
import { IsCpfCnpj } from "src/shared/decorators/is-cpf-cnpj.decorator";

export class ClientAddressCreateCsDto {
  @ApiProperty({
    description: 'Rua do endereço do cliente',
    example: 'Rua das Flores',
  })
  @IsString({ message: "street deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  street: string;

  @ApiProperty({
    description: 'Bairro do endereço do cliente',
    example: 'Jardim Primavera',
  })
  @IsString({ message: "neighborhood deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  neighborhood: string;

  @ApiProperty({
    description: 'Complemento do endereço do cliente',
    example: 'Casa, apartamento, etc.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "complement deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  complement?: string;

  @ApiProperty({
    description: 'Cidade do endereço do cliente',
    example: 'São Paulo',
  })
  @IsString({ message: "city deve ser uma string" })
  @Transform(({ value }) => value?.trim())
  city: string;

  @ApiProperty({
    description: 'Estado do endereço do cliente',
    example: 'SP',
  })
  @IsString({ message: "state deve ser uma string" })
  @Transform(({ value }) => value?.trim().toUpperCase())
  state: string;

  @ApiProperty({
    description: 'Número do endereço do cliente',
    example: '123',
  })
  @IsInt({ message: "number deve ser um número inteiro" })
  @Transform(({ value }) => parseInt(value, 10))
  number: number;

  @ApiProperty({
    description: 'CEP do endereço do cliente - apenas dígitos',
    example: '12345678',
  })
  @IsString({ message: "zipCode deve ser uma string" })
  @IsNumberString({}, { message: "zipCode deve conter apenas números" })
  @Transform(({ value }) => value?.replace(/\D/g, ""))
  zipCode: string;
}

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
  @IsCpfCnpj()
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

  @ApiProperty({
    description: 'Endereço do cliente',
    type: ClientAddressCreateCsDto,
  })
  address: ClientAddressCreateCsDto;
}