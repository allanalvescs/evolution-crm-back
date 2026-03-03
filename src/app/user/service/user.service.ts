import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { UserRepository } from "src/domain/repositories/user.repository";
import { EUserRole } from "src/shared/enum/user-role.enum";
import { UserMeScResponseDto } from "../dtos/user-me-sc.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async me(payload: { id: number, name: string, email: string, role: EUserRole }) {
    const user = await this.userRepository.findById(payload.id);

    const result = plainToInstance(UserMeScResponseDto, user, { excludeExtraneousValues: true });

    return result;
  }
}