import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ onCreate: () => new Date().toISOString(), type: 'timestamp with time zone' })
  dtCreatedAt?: Date;
  
  @Property({ onCreate: () => new Date().toISOString(), onUpdate: () => new Date().toISOString(), type: 'timestamp with time zone' })
  dtUpdatedAt?: Date;
}