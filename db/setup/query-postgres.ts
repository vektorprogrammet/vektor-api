import "dotenv/config";
import { databaseConnectionParameters } from "@/db/config/parameters";
import {
	getDatabaseErrorPrivateMessage,
	postgresErrorParser,
} from "@/db/errors/postgres-error";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg"; // It does not work to import { Client } from "pg"

export const postgresClient = new pg.Client(databaseConnectionParameters);
try {
	await postgresClient.connect();
} catch (error) {
	console.error("Failed to connect to database.");
	const errorResult = postgresErrorParser.safeParse(error);
	if (errorResult.success) {
		console.error(getDatabaseErrorPrivateMessage(errorResult.data));
	} else {
		console.error(error);
	}
	process.exit(1);
}
export const database = drizzle(postgresClient);

console.info("Successfully connected to database.");
