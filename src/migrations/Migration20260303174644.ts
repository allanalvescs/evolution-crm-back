import { Migration } from '@mikro-orm/migrations';

export class Migration20260303174644 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "client_address" ("id" serial primary key, "dt_created_at" timestamptz not null, "dt_updated_at" timestamptz not null, "id_client" int not null, "street" varchar(255) not null, "neighborhood" varchar(255) not null, "complement" varchar(255) null, "city" varchar(255) not null, "state" varchar(255) not null, "zip_code" varchar(255) not null, "country" varchar(255) not null);`);

    this.addSql(`alter table "client_address" add constraint "client_address_id_client_foreign" foreign key ("id_client") references "clients" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "client_address" cascade;`);
  }

}
