import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";

const config: Options<PostgreSqlDriver> = {
    host: 'localhost',
    port: 5432,
    user: "admin",
    password: "postgres",
    dbName: 'evolution-crm',
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    migrations: {
        path: path.resolve(__dirname, './src/migrations'),
        pathTs: path.resolve(__dirname, './src/migrations'),
    },
    driver: PostgreSqlDriver,
    debug: true,
};

export default config;