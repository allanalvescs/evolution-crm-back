import { Client } from "src/infrastructure/entities/client.entity";
import { Client as ClientDomain } from "src/domain/entities/client";
import { EStatus } from "src/shared/enum/generic-status";

export class ClientMapper {
  static toDomainEntity(orm: Client): ClientDomain {
    const domain = new ClientDomain();

    domain.id = orm.id;
    domain.name = orm.name;
    domain.email = orm.email;
    domain.phone = orm.phone;
    domain.cpfCnpj = orm.cpfCnpj;
    domain.type = orm.type;
    domain.status = EStatus.ACTIVE;
    domain.dtCreatedAt = orm.dtCreatedAt || new Date();
    domain.dtUpdatedAt = orm.dtUpdatedAt || new Date();

    return domain;
  }

  static toOrmEntity(domain: ClientDomain): Client {
    const orm = new Client();

    orm.name = domain.name;
    orm.email = domain.email;
    orm.phone = domain.phone;
    orm.cpfCnpj = domain.cpfCnpj;
    orm.type = domain.type;
    orm.status = domain.status;
    orm.dtCreatedAt = domain.dtCreatedAt;
    orm.dtUpdatedAt = domain.dtUpdatedAt;

    return orm;
  }
}