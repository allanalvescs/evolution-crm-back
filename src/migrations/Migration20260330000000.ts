import { Migration } from "@mikro-orm/migrations";

export class Migration20260330000000 extends Migration {
  override async up(): Promise<void> {
    // Drop FK from clients referencing users.id
    this.addSql(
      `alter table "clients" drop constraint if exists "clients_id_user_foreign";`,
    );

    // Add phone column to users
    this.addSql(
      `alter table "users" add column if not exists "phone" varchar(255) null;`,
    );

    // Enable pgcrypto for gen_random_uuid() — available in PostgreSQL 13+
    this.addSql(`create extension if not exists "pgcrypto";`);

    // Change users.id from serial/integer to uuid (tables are empty)
    this.addSql(`alter table "users" drop column "id";`);
    this.addSql(
      `alter table "users" add column "id" uuid not null default gen_random_uuid() primary key;`,
    );

    // Change clients.id_user from int to uuid
    this.addSql(`alter table "clients" drop column "id_user";`);
    this.addSql(`alter table "clients" add column "id_user" uuid not null;`);

    // Re-add FK
    this.addSql(
      `alter table "clients" add constraint "clients_id_user_foreign" foreign key ("id_user") references "users" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "clients" drop constraint if exists "clients_id_user_foreign";`,
    );
    this.addSql(`alter table "clients" drop column "id_user";`);
    this.addSql(`alter table "clients" add column "id_user" int not null;`);

    this.addSql(`alter table "users" drop column "id";`);
    this.addSql(`alter table "users" add column "id" serial primary key;`);

    this.addSql(`alter table "users" drop column if exists "phone";`);

    this.addSql(
      `alter table "clients" add constraint "clients_id_user_foreign" foreign key ("id_user") references "users" ("id") on update cascade;`,
    );
  }
}
