import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PasswordHasher } from 'src/domain/contracts/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }
}
