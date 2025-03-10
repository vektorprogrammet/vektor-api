import "dotenv/config";
import { databaseConnectionParameters } from "@/db/config/parameters";
import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: this is needed for drizzle to work correctly
export default defineConfig({
	schema: "./db/tables/*",
	out: "./db/migrations",
	dialect: "postgresql",
	dbCredentials: databaseConnectionParameters,
	verbose: true,
	strict: true,
});
