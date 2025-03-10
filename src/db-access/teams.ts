import { database } from "@/db/setup/query-postgres";
import { teamsTable } from "@/db/tables/teams";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type { Team, TeamKey } from "@/src/response-handling/teams";
import { inArray } from "drizzle-orm";
import { newDatabaseTransaction } from "./common";

export async function selectTeamsById(
	teamIds: TeamKey[],
): Promise<OrmResult<Team[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select()
			.from(teamsTable)
			.where(inArray(teamsTable.id, teamIds));
		if (selectResult.length !== teamIds.length) {
			throw ormError("Couln't find all entries");
		}
		return selectResult;
	});
}
