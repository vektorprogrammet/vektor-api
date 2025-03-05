import "dotenv/config";
import { databaseConnectionParameters } from "@db/config/parameters";
import {
	getDatabaseErrorPrivateMessage,
	postgresErrorParser,
} from "@db/errors/postgresError";
import { postgresClient } from "@db/setup/queryPostgres";

try {
	const databaseListResponse = await postgresClient.query(
		`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${databaseConnectionParameters.database}';`,
	);

	if (databaseListResponse.rowCount === 0) {
		console.log(
			`${databaseConnectionParameters.database} database not found, creating it`,
		);
		await postgresClient.query(
			`CREATE DATABASE '${databaseConnectionParameters.database}';`,
		);
		console.log(`Created database ${databaseConnectionParameters.database}`);
	} else {
		console.log(`Database ${databaseConnectionParameters.database} exists`);
	}
	await postgresClient.end();
} catch (error) {
	const errorResult = postgresErrorParser.safeParse(error);
	if (errorResult.success) {
		console.error(getDatabaseErrorPrivateMessage(errorResult.data));
	} else {
		console.error(error);
	}
	await postgresClient.end();
	console.error("Error when checking if database already exists.");
	process.exit(1);
}