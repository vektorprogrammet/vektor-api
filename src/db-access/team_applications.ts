import { database } from "@db/setup/queryPostgres";
import { teamApplicationsTable } from "@db/tables/teamApplication";
import {
	type DatabaseResult,
	catchDatabase,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { QueryParameters } from "@src/request-handling/common";
import type {
	TeamApplication,
	TeamKey,
} from "@src/response-handling/team_application";
import { asc, inArray } from "drizzle-orm";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<DatabaseResult<TeamApplication[]>> => {
	return catchDatabase(async () => {
		return await database
			.select()
			.from(teamApplicationsTable)
			.orderBy(asc(teamApplicationsTable.id))
			.limit(parameters.limit)
			.offset(parameters.offset);
	});
};

export const selectTeamApplicationsByTeamId = async (
	teamId: TeamKey[],
): Promise<DatabaseResult<TeamApplication[]>> => {
	return database
		.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(teamApplicationsTable)
				.where(inArray(teamApplicationsTable.teamId, teamId));
			if (selectResult.length == teamId.length) {
				return selectResult;
			}
			throw ormError(
				"Couldn't select team applications, id's (team) didn't exist.",
			);
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
};
