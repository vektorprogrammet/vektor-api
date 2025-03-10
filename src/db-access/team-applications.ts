import { database } from "@/db/setup/query-postgres";
import { teamApplicationsTable } from "@/db/tables/team-applications";
import {
	type OrmResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
} from "@/src/error/orm-error";
import type { QueryParameters } from "@/src/request-handling/common";
import type { NewTeamApplication } from "@/src/request-handling/team-applications";
import type {
	TeamApplication,
	TeamKey,
} from "@/src/response-handling/team-applications";
import { asc, inArray } from "drizzle-orm";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await database
		.transaction(async (tx) => {
			return await tx
				.select()
				.from(teamApplicationsTable)
				.orderBy(asc(teamApplicationsTable.id))
				.limit(parameters.limit)
				.offset(parameters.offset);
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
};

export const selectTeamApplicationsByTeamId = async (
	teamId: TeamKey[],
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await database
		.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(teamApplicationsTable)
				.where(inArray(teamApplicationsTable.teamId, teamId))
				.limit(parameters.limit)
				.offset(parameters.offset);
			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
};

export async function insertTeamApplication(
	teamApplication: NewTeamApplication[],
): Promise<OrmResult<TeamApplication[]>> {
	return await database
		.transaction(async (tx) => {
			const insertResult = await tx
				.insert(teamApplicationsTable)
				.values(teamApplication)
				.returning();
			return insertResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
