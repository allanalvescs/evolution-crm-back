import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";
import { DEFAULT_CIPHERS } from "tls";

class Env {
    @IsString()
    @IsNotEmpty()
    jwtSecret: string;

    @IsString()
    @IsNotEmpty()
    dbUser: string;

    @IsString()
    @IsNotEmpty()
    dbPassword: string;

    @IsString()
    @IsNotEmpty()
    dbHost: string;

    @IsString()
    @IsNotEmpty()
    dbName: string;
}

export const env: Env = plainToInstance(Env, {
    jwtSecret: process.env.JWT_SECRET,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
});

const errors = validateSync(env);

if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 4))
}