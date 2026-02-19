import { Entity, Property, Enum } from "@mikro-orm/core";
import { EUserRole } from "../../utils/enum/user-role.enum";
import { BaseEntity } from "./base-entity";
@Entity({ 
    tableName: 'users'
})
export class User extends BaseEntity {
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

    @Property({ nullable: false })
    @Enum(() => EUserRole)
    role!: EUserRole;

    @Property({ nullable: true, type: 'timestamp with time zone' })
    dtLastLoginAt?: Date;

}
