import 'dotenv/config';
import { databaseConnectionParameters } from "@db/config/parameters";
import mysql from "mysql2/promise";

import { drizzle } from "drizzle-orm/mysql2";

console.log("Database parameters:", databaseConnectionParameters);
export const mysqlClient = await mysql.createConnection(databaseConnectionParameters);
export const database = drizzle(mysqlClient);

console.log("Successfully connected to database.");