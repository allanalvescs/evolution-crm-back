import { Migration } from '@mikro-orm/migrations';

export class Migration20260303145617 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "clients" ("id" serial primary key, "dt_created_at" timestamptz not null, "dt_updated_at" timestamptz not null, "name" varchar(255) not null, "company_name" varchar(255) null, "email" varchar(255) not null, "type" varchar(255) not null, "cpf_cnpj" varchar(255) not null, "status" varchar(255) not null default 'ACTIVE', "phone" varchar(255) null, "id_user" int not null);`);

    this.addSql(`alter table "clients" add constraint "clients_id_user_foreign" foreign key ("id_user") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "clients" cascade;`);
  }

}
