import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { UserRepository } from "src/domain/repositories/user.repository";

@Injectable()
export class AuthValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async validate({ email, password }: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(email);

    const isValidPassword = await compare(password, user?.password || '');

    if (!user || !isValidPassword) {
      throw new UnauthorizedException(
        'Credenciais inválidas - Verifique se seu email e senha',
      );
    }
    
    return user;
  }
}