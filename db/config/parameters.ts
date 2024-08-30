import "dotenv"
import * as process from "node:process";

const enviromentVariables = process.env;

interface databaseConnectionParameterInterface {
    host: string;
    database: string;
    user: string;
    password: string;
}

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

export const databaseConnectionParameters: databaseConnectionParameterInterface =  {
    host: enviromentVariables.DATABASE_HOST,
    database: enviromentVariables.DATABASE_NAME,
    user: enviromentVariables.DATABASE_USER,
    password: enviromentVariables.DATABASE_PASSWORD,
};