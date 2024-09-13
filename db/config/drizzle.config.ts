import { defineConfig } from 'drizzle-kit';
import { drizzleDatabaseCredentials } from "@db/config/parameters";

export default defineConfig({
    schema: './db/schema/*',
    out: './db/migrations',
    dialect: 'postgresql',
    dbCredentials: drizzleDatabaseCredentials,
    verbose: true,
    strict: true,
});