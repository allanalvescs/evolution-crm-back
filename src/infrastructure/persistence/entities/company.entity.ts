import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

@Entity({ tableName: "companies" })
export class CompanyEntity extends BaseEntity {
  @Property()
  tradeName!: string;

  @Property()
  companyName!: string;

  @Property({ unique: true })
  cnpj!: string;

  @Property({ nullable: true })
  phone?: string;

  @ManyToOne(() => UserEntity, { fieldName: "user_id" })
  user!: UserEntity;
}
