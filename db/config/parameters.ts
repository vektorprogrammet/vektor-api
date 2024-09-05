import "dotenv"
import * as process from "node:process";
import { ConnectionOptions } from "mysql2";

const enviromentVariables = process.env;

if(!enviromentVariables.DATABASE_HOST) {
    throw new Error('Missing DATABASE_HOST');
}
if(!enviromentVariables.DATABASE_NAME) {
    throw new Error('Missing DATABASE_NAME');
}
if(!enviromentVariables.DATABASE_USER) {
    throw new Error('Missing DATABASE_USER');
}
if(!enviromentVariables.DATABASE_PASSWORD) {
    throw new Error('Missing DATABASE_PASSWORD');
}

if(!enviromentVariables.DATABASE_PORT) {
    throw new Error('Missing DATABASE_PORT');
}
let portAsNumber = parseInt(enviromentVariables.DATABASE_PORT);
if(isNaN(portAsNumber)) {
    throw new Error('Invalid DATABASE_PORT');
}

export const databaseConnectionParameters: ConnectionOptions =  {
    host: enviromentVariables.DATABASE_HOST,
    database: enviromentVariables.DATABASE_NAME,
    user: enviromentVariables.DATABASE_USER,
    password: enviromentVariables.DATABASE_PASSWORD,
    port: portAsNumber,
};

type DatabaseCredentials = { host: string; port?: number; user?: string; password?: string; database: string; ssl?: string; } | { url: string; };

export const drizzleDatabaseCredentials: DatabaseCredentials = {
    host: enviromentVariables.DATABASE_HOST,
    database: enviromentVariables.DATABASE_NAME,
    user: enviromentVariables.DATABASE_USER,
    password: enviromentVariables.DATABASE_PASSWORD,
    port: portAsNumber,
}