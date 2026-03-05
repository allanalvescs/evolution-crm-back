import { plainToInstance, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";
import dotenv from "dotenv";

dotenv.config();

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

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    dbPort: number;

    @IsString()
    @IsNotEmpty()
    rabbitmqUri: string;

}

export const env: Env = plainToInstance(Env, {
    jwtSecret: process.env.JWT_SECRET,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    rabbitmqUri: process.env.RABBITMQ_URI,
});

const errors = validateSync(env);

if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 4))
}