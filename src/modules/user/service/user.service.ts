import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserMeScResponseDto } from "../dtos/user-me-sc.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async me(payload: { id: string; email: string; role: string }) {
    const user = await this.userRepository.findById(payload.id);

    const result = plainToInstance(UserMeScResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return result;
  }
}
