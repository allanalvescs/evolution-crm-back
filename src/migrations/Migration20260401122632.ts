import { Migration } from "@mikro-orm/migrations";

export class Migration20260401122632 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table "companies" (
        "id" uuid not null default gen_random_uuid() primary key,
        "trade_name" varchar(255) not null,
        "company_name" varchar(255) not null,
        "cnpj" varchar(14) not null,
        "phone" varchar(255) null,
        "user_id" uuid not null,
        "dt_created_at" timestamp with time zone not null,
        "dt_updated_at" timestamp with time zone not null
      );
    `);

    this.addSql(
      `alter table "companies" add constraint "companies_cnpj_unique" unique ("cnpj");`,
    );

    this.addSql(`
      alter table "companies"
        add constraint "companies_user_id_foreign"
        foreign key ("user_id") references "users" ("id") on update cascade;
    `);

    this.addSql(
      `alter table "users" add column if not exists "company_id" uuid null;`,
    );

    this.addSql(`
      alter table "users"
        add constraint "users_company_id_foreign"
        foreign key ("company_id") references "companies" ("id") on update cascade on delete set null;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "users" drop constraint if exists "users_company_id_foreign";`,
    );
    this.addSql(`alter table "users" drop column if exists "company_id";`);

    this.addSql(`drop table if exists "companies" cascade;`);
  }
}
