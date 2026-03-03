import { ApiProperty } from "@nestjs/swagger";

export class SignupScResponse {
    @ApiProperty({
        description: "ID do usuário",
        example: 1
    })
    id: number;

    @ApiProperty({
        description: "Nome do usuário",
        example: "Allan"
    })
    name: string;

    @ApiProperty({
        description: "Email do usuário",
        example: "allan@gmail.com"
    })
    email: string;

    @ApiProperty({
        description: "Sobrenome do usuário",
        example: "Silva"
    })
    surname: string;

    @ApiProperty({
        description: "Senha do usuário",
        example: "$2b$12$0md2Z047wUlD/HpNlI0PaO5kktxILBQRWFSHEULvQQgFo9Q4Vxsnq"
    })
    password: string;

    @ApiProperty({
        description: "Função do usuário",
        example: "ADMIN"
    })
    role: string;

    @ApiProperty({
        description: "Token JWT do usuário",
        example: null
    })
    tokenJwt: string | null;

    @ApiProperty({
        description: "URL do avatar do usuário",
        example: null
    })
    avatarUrl: string | null;

    @ApiProperty({
        description: "Data do último login do usuário",
        example: null
    })
    dtLastLoginAt: Date | null;

    @ApiProperty({
        description: "Data de criação do usuário",
        example: "2026-03-03T16:55:04.204Z"
    })
    dtCreatedAt: Date;

    @ApiProperty({
        description: "Data de atualização do usuário",
        example: "2026-03-03T16:55:04.204Z"
    })
    dtUpdatedAt: Date;
}