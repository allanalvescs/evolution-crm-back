import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const ExtractPayload = createParamDecorator<undefined>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log({ user });

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return user;
  }
);