import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import { EUserRole } from "../enum/user-role.enum";

@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ autoincrement: true })
    id!: number;

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

    @Property({ onCreate: () => new Date().toISOString(), type: 'timestamp with time zone' })
    dtCreatedAt?: Date;

    @Property({ onCreate: () => new Date().toISOString(), onUpdate: () => new Date().toISOString(), type: 'timestamp with time zone' })
    dtUpdatedAt?: Date;
}
