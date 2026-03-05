import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CnpjService {
  constructor(private readonly httpService: HttpService) {}

  async consult(cnpj: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
        )
      );

      return response.data;

    } catch (error) {
      throw new NotFoundException('CNPJ não encontrado na Receita');
    }
  }
}