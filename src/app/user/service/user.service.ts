import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/domain/repositories/user.repository";
import { EUserRole } from "src/shared/enum/user-role.enum";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async me(payload: { id: number, name: string, email: string, role: EUserRole }) {
    const user = await this.userRepository.findById(payload.id);

    return user;
  }
}