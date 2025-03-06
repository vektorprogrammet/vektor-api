import {
	getDatabaseErrorPrivateMessage,
	postgresErrorParser,
} from "@db/errors/postgresError";
import { seedingTables } from "@db/seeding/seedingTables";
import { database } from "@db/setup/queryPostgres";
import { reset, seed } from "drizzle-seed";

const doRevertSeeding =
	process.argv.length === 3 && process.argv[2] === "--reset";
const hasUnknownOption =
	process.argv.length > 3 ||
	(process.argv.length === 3 && process.argv[2] !== "--reset");
if (hasUnknownOption) {
	console.error("Unknown option");
	process.exit(1);
}

if (doRevertSeeding) {
	await reset(database, seedingTables);
	console.log("Database seeding has been reverted");
	process.exit(0);
}

try {
	await seed(database, seedingTables);
	console.log("Database has been seeded");
} catch (error) {
	const postgresErrorResult = postgresErrorParser.safeParse(error);
	if (postgresErrorResult.success) {
		console.error("Database error:");
		console.error(getDatabaseErrorPrivateMessage(postgresErrorResult.data));
	} else if (error instanceof Error) {
		// The drizzle-seed library has awful errorhandling and just throws
		// new Error() everywhere. So this is the best way to handle it
		console.error(error.message);
	} else {
		console.error(error);
	}
	if (doRevertSeeding) {
		console.error("Failed to reset seeded database");
	} else {
		console.error("Failed to seed database");
		await reset(database, seedingTables);
	}
	process.exit(1);
}

process.exit(0);
