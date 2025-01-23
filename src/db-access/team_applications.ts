import { teamApplicationsTable } from "@db/tables/teamApplication";
import { database } from "@db/setup/queryPostgres";
import { catchDatabase, DatabaseResult } from "@src/error/ormError";
import { asc } from 'drizzle-orm';
import { TeamApplication } from "@src/response-handling/team_application";

export const getTeamApplications = async (
    limit: number
): Promise<DatabaseResult<TeamApplication[]>> => {
    return catchDatabase( async () => {
        return await database
        .select()
        .from(teamApplicationsTable)
        .orderBy(asc(teamApplicationsTable.id))
        .limit(limit)
        }

    )
}