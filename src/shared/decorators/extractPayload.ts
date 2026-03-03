import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { IsEnum, IsInt, IsString, } from "class-validator";
import { EUserRole } from "../enum/user-role.enum";

export class ExtractPayloadDto {
  @IsInt()
  id: number;

  @IsString()
  email: string;

  @IsEnum(EUserRole)
  role: EUserRole;
}

export const ExtractPayload = createParamDecorator<ExtractPayloadDto>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = {
      id: request.user.id,
      email: request.user.email,
      role: request.user.role,
    };

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return user;
  }
);