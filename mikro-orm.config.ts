import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";
import { env } from "src/config/env";

const config: Options<PostgreSqlDriver> = {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    dbName: env.dbName,
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