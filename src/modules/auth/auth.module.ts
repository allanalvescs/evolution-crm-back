import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtModule } from "@nestjs/jwt"
import { env } from "src/infrastructure/config/env";
import { ValidatorModule } from "src/applications/validator/validator.module";
import { BcryptPasswordHasher } from "src/infrastructure/services/bcrypt-password-hasher.service";
import { JwtTokenGenerator } from "src/infrastructure/services/jwt-token-generator";

export const PASSWORD_HASHER = "PasswordHasher";
export const TOKEN_GENERATOR = "TokenGenerator";

@Module({
    imports: [
    JwtModule.register({
        global: true,
        secret: env.jwtSecret,
        signOptions: { expiresIn: '7d' },
        }),
        ValidatorModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },
        {
            provide: TOKEN_GENERATOR,
            useClass: JwtTokenGenerator,
        },
    ],
    exports: [PASSWORD_HASHER],
})
export class AuthModule {}