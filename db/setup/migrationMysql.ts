import { migrate } from 'drizzle-orm/mysql2/migrator';
import {database, mysqlClient } from "@db/setup/queryMysql";

await migrate(database, { migrationsFolder: '@db/migrations' });

await mysqlClient.end();