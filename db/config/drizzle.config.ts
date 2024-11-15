import "dotenv/config";
import { databaseConnectionParameters } from "@db/config/parameters";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./db/tables/*",
	out: "./db/migrations",
	dialect: "postgresql",
	dbCredentials: databaseConnectionParameters,
	verbose: true,
	strict: true,
});
