import { database } from "@db/setup/queryPostgres";
import { teamsTable } from "@db/tables/team";
import {
	type ORMResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { Team, TeamKey } from "@src/response-handling/teams";
import { inArray } from "drizzle-orm";

export async function selectTeamsById(
	teamIds: TeamKey[],
): Promise<ORMResult<Team[]>> {
	return database
		.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(teamsTable)
				.where(inArray(teamsTable.id, teamIds));
			if (selectResult.length !== teamIds.length) {
				throw ormError("Couldn't select teams, id's didn't exist.");
			}
			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
