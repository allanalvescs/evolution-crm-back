import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Client as ClientDomain } from "src/domain/entities/client";
import { ClientRepository } from "src/domain/repositories/client.repository";
import { Client } from "src/infrastructure/entities/client.entity";
import { ClientMapper } from "../mappers/client.mapper";

@Injectable()
export class MikroOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(Client) protected readonly orm: EntityRepository<Client>,
    private readonly em: EntityManager
  ) {}

  async create(client: ClientDomain): Promise<ClientDomain> {
    const entity = ClientMapper.toOrmEntity(client);

    this.em.persist(entity);

    await this.em.flush();

    return ClientMapper.toDomainEntity(entity);
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<ClientDomain | null> {
    const entity = await this.em.findOne(Client, { cpfCnpj });

    return entity ? ClientMapper.toDomainEntity(entity) : null;
  }
}