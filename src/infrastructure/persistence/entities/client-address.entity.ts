import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity";
import { Client } from "./client.entity";

@Entity({
  tableName: 'client_address'
})
export class ClientAddress extends BaseEntity {
  @ManyToOne(() => Client, { fieldName: "id_client" })
  idClient: Client;

  @Property()
  street: string;

  @Property()
  neighborhood: string;

  @Property({ nullable: true })
  complement?: string;

  @Property()
  city: string;

  @Property()
  state: string;

  @Property()
  zipCode: string;

  @Property()
  country: string;
}