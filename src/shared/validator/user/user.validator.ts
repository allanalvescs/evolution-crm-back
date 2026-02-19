import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "src/domain/repositories/user.repository";

@Injectable()
export class UserValidator {
  constructor(private readonly userRepository: UserRepository) {}
  
  async existByEmail(email: string) {
     const user = await this.userRepository.findByEmail(email);
    
      if (user) {
        throw new HttpException("Já existe um usuário com esse email", HttpStatus.BAD_REQUEST);
      }
  }
}