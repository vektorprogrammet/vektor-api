import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {database, postgresClient } from "@db/setup/queryPostgres";

await migrate(database, { migrationsFolder: '@db/migrations' });

await postgresClient.end();