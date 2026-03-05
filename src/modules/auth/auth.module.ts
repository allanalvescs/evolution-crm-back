import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtModule } from "@nestjs/jwt"
import { env } from "src/infrastructure/config/env";
import { ValidatorModule } from "src/applications/validator/validator.module";

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
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}