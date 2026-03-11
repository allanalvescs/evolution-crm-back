import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { env } from 'src/infrastructure/config/env';

@Injectable()
export class CnpjService {
  constructor(private readonly httpService: HttpService) {}

  async consult(cnpj: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.BRASIL_API_CNPJ_URL}/${cnpj}`
        )
      );

      return response.data;

    } catch (error) {
      throw new NotFoundException('CNPJ não encontrado na Receita');
    }
  }
}