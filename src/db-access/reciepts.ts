import { recieptsTable } from "@db-tables/reciepts";
import { usersTable } from "@db-tables/users";
import { database } from "@db/setup/queryPostgres";
import type {
	NewReciept,
	Reciept,
	RecieptKey,
} from "@src/db-validation/reciepts";
import {
	type DatabaseResult,
	catchDatabase,
	ormError,
} from "@src/error/ormError";
import { inArray, sql } from "drizzle-orm";

export async function insertReciepts(
	reciepts: NewReciept[],
): Promise<DatabaseResult<Reciept[]>> {
	return catchDatabase(() => {
		return database.transaction(async (tx) => {
			const selectResult = await tx
				.select({ exists: sql`1` })
				.from(usersTable)
				.where(
					inArray(
						usersTable.id,
						reciepts.map((r) => r.userId),
					),
				);
			if (selectResult.length !== reciepts.length) {
				throw ormError("User creating recipt does not exist.");
			}
			const insertResult = await tx
				.insert(recieptsTable)
				.values(reciepts)
				.returning();
			return insertResult;
		});
	});
}

export async function paybackReciepts(
	recieptIds: RecieptKey[],
): Promise<DatabaseResult<Reciept[]>> {
	return catchDatabase(() => {
		return database.transaction(async (tx) => {
			const updateResult = await database
				.update(recieptsTable)
				.set({ payBackDate: new Date() })
				.where(inArray(recieptsTable.id, recieptIds))
				.returning();
			if (updateResult.length !== recieptIds.length) {
				throw ormError("Couldn't update, some id's didn't exist.");
			}
			return updateResult;
		});
	});
}

export async function selectRecipts(
	recieptIds: RecieptKey[],
): Promise<DatabaseResult<Reciept[]>> {
	return catchDatabase(() => {
		return database.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(recieptsTable)
				.where(inArray(recieptsTable.id, recieptIds));
			if (selectResult.length !== recieptIds.length) {
				throw ormError("Couldn't select receipts, id's didn't exist.");
			}
			return selectResult;
		});
	});
}
