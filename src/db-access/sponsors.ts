import { database } from "@/db/setup/query-postgres";
import { sponsorsTable } from "@/db/tables/sponsors";
import { newDatabaseTransaction } from "@/src/db-access/common";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type { NewSponsor } from "@/src/request-handling/sponsors";
import type { Sponsor, SponsorKey } from "@/src/response-handling/sponsors";
import { inArray } from "drizzle-orm";

export async function insertSponsors(
	sponsors: NewSponsor[],
): Promise<OrmResult<NewSponsor[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		return await tx.insert(sponsorsTable).values(sponsors).returning();
	});
}

export async function selectSponsorsById(
	sponsorIds: SponsorKey[],
): Promise<OrmResult<Sponsor[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select()
			.from(sponsorsTable)
			.where(inArray(sponsorsTable.id, sponsorIds));
		if (selectResult.length !== sponsorIds.length) {
			throw ormError("Couln't find all entries");
		}
		return selectResult;
	});
}
