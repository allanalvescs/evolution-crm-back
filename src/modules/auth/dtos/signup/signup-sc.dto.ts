import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SignupScResponseDto {
    @Expose()
    @ApiProperty({
        description: "ID do usuário",
        example: 1
    })
    id: number;

    @Expose()
    @ApiProperty({
        description: "Nome do usuário",
        example: "Allan"
    })
    name: string;

    @Expose()
    @ApiProperty({
        description: "Email do usuário",
        example: "allan@gmail.com"
    })
    email: string;

    @Expose()
    @ApiProperty({
        description: "Sobrenome do usuário",
        example: "Silva"
    })
    surname: string | null;

    @Expose()
    @ApiProperty({
        description: "Função do usuário",
        example: "ADMIN"
    })
    role: string;

    @Expose()
    @ApiProperty({
        description: "URL do avatar do usuário",
        example: null
    })
    avatarUrl: string | null;

    @Expose()
    @ApiProperty({
        description: "Data do último login do usuário",
        example: null
    })
    dtLastLoginAt: Date | null;

    @Expose()
    @ApiProperty({
        description: "Data de criação do usuário",
        example: "2026-03-03T16:55:04.204Z"
    })
    dtCreatedAt: Date;

    @Expose()
    @ApiProperty({
        description: "Data de atualização do usuário",
        example: "2026-03-03T16:55:04.204Z"
    })
    dtUpdatedAt: Date | null;
}