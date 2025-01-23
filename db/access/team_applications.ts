import { TeamApplication, teamApplicationsTable } from "@db/schema/teamApplication";
import { database } from "@db/setup/queryPostgres";
import { catchDatabase, DatabaseResult } from "@src/error/dbErrors";
import { asc } from 'drizzle-orm';

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