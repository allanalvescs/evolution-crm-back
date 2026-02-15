import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import { EUserRole } from "../enum/user-role.enum";

@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ autoincrement: true })
    id!: number;

    @Property()
    name!: string;

    @Property()
    surname!: string;

    @Property({ unique: true })
    email!: string;

    @Property()
    password!: string;

    @Property({ nullable: true })
    tokenJwt?: string;

    @Property({ nullable: true })
    avatarUrl?: string;

    @Enum(() => EUserRole)
    role!: EUserRole;

    @Property({ nullable: true })
    dtLastLogin?: Date;

    @Property({ onCreate: () => new Date() })
    dtCreated!: Date;

    @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
    dtUpdated!: Date;
}
