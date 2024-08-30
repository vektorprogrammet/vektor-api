import type { defineConfig } from 'drizzle-kit';
import { databaseConnectionParameters } from "@db/config/parameters";

export default defineConfig({
    schema: 'db/schema/*',
    out: 'db/migrations',
    dialect: 'mysql',
    dbCredentials: databaseConnectionParameters,
    verbose: true,
    strict: true,
});