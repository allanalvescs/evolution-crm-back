import { Entity, Property, Enum } from "@mikro-orm/core";
import { EUserRole } from "../../../shared/enum/user-role.enum";
import { BaseEntity } from "./base-entity";
@Entity({
  tableName: "users",
})
export class UserEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  surname?: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  tokenJwt?: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property()
  @Enum(() => EUserRole)
  role!: EUserRole;

  @Property({ nullable: true, type: "timestamp with time zone" })
  dtLastLoginAt?: Date;
}
