import { Migration } from '@mikro-orm/migrations';

export class Migration20260215202948 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "name" varchar(255) not null, "surname" varchar(255) null, "email" varchar(255) not null, "password" varchar(255) not null, "token_jwt" varchar(255) null, "avatar_url" varchar(255) null, "role" varchar(255) not null, "dt_last_login_at" timestamp null, "dt_created_at" timestamp not null, "dt_updated_at" timestamp not null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
