import 'dotenv/config';
import { databaseConnectionParameters } from "@db/config/parameters";
import { usersSchema } from "@db/schema/users";
import mysql from "mysql2/promise";

import { drizzle } from "drizzle-orm/mysql2";

export const mysqlClient = await new mysql.createConnection(databaseConnectionParameters);

export const database = drizzle(mysqlClient, { schema: { usersSchema: usersSchema } });