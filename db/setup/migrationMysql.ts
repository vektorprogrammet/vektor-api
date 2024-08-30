import { migrate } from 'drizzle-orm/postgres-js/migrator';
import {pgClient, database} from "@db/setup/queryMysql";

await migrate(database, { migrationsFolder: 'db/migrations' });

await pgClient.end();