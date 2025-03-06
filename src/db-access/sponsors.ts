import { database } from "@db/setup/queryPostgres";
import { sponsorsTable } from "@db/tables/sponsors";
import {
	type OrmResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { NewSponsor } from "@src/request-handling/sponsors";
import type { Sponsor, SponsorKey } from "@src/response-handling/sponsors";
import { inArray } from "drizzle-orm";

export async function insertSponsors(
	sponsors: NewSponsor[],
): Promise<OrmResult<Sponsor[]>> {
	return database
		.transaction(async (tx) => {
			const insertResult = await tx
				.insert(sponsorsTable)
				.values(sponsors)
				.returning();
			return insertResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectSponsorsById(
	sponsorIds: SponsorKey[],
): Promise<OrmResult<Sponsor[]>> {
	return database
		.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(sponsorsTable)
				.where(inArray(sponsorsTable.id, sponsorIds));
			if (selectResult.length !== sponsorIds.length) {
				throw ormError("Couln't find all entries");
			}
			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
