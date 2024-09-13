import "dotenv"
import * as process from "node:process";

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

interface DatabaseConnectionOptions {
    host: string,
    database: string,
    user: string,
    password: string,
    port: number,
}
export const databaseConnectionParameters: DatabaseConnectionOptions =  {
    host: enviromentVariables.DATABASE_HOST,
    database: enviromentVariables.DATABASE_NAME,
    user: enviromentVariables.DATABASE_USER,
    password: enviromentVariables.DATABASE_PASSWORD,
    port: portAsNumber,
};

// Type defined at https://orm.drizzle.team/kit-docs/config-reference#dbcredentials
export const drizzleDatabaseCredentials = {
    host: enviromentVariables.DATABASE_HOST,
    port: portAsNumber,
    user: enviromentVariables.DATABASE_USER,
    password: enviromentVariables.DATABASE_PASSWORD,
    database: enviromentVariables.DATABASE_NAME,
    ssl: false, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  }