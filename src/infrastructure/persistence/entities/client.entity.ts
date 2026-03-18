import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity";
import { EClientType } from "src/shared/enum/client-type";
import { EStatus } from "src/shared/enum/generic-status";
import { User } from "./user.entity";

@Entity({
  tableName: 'clients'
})
export class Client extends BaseEntity {
    @Property()
    name: string;
    
    @Property({ nullable: true })
    companyName?: string;

    @Property()
    email: string;

    @Property()
    @Enum(() => EClientType)
    type: EClientType;

    @Property()
    cpfCnpj: string;

    @Property({ default: EStatus.ACTIVE })
    @Enum(() => EStatus)
    status: EStatus;

    @Property({ nullable: true })
    phone?: string;

    @ManyToOne(() => User, { fieldName: "id_user" })
    idUser: User;
}
