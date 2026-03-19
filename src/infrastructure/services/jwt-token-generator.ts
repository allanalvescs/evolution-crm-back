import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  TokenGenerator,
  TokenPayload,
} from "src/domain/contracts/token-generator.interface";

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
