import "dotenv/config";
import { databaseConnectionParameters } from "@db/config/parameters";
import { getPgErrorName, isPgError, isValidPgCode } from "@db/errors/pgErrors";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg"; // It does not work to import { Client } from "pg"

export const postgresClient = new pg.Client(databaseConnectionParameters);
try {
	await postgresClient.connect();
} catch (connectionError) {
	console.error("Failed to connect to database.");
	if (isPgError(connectionError) && isValidPgCode(connectionError.code)) {
		console.error(
			connectionError.severity,
			":",
			connectionError.code,
			":",
			getPgErrorName(connectionError.code),
			":",
			connectionError.message,
		);
	} else {
		console.error(connectionError);
	}
	process.exit(1);
}
export const database = drizzle(postgresClient);

console.log("Successfully connected to database.");
