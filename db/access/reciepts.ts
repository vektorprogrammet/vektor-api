import { database } from "@db/setup/queryPostgres";
import { recieptsTable, NewReciept, RecieptId, Reciept } from "@db/schema/reciepts";
import { sql, inArray } from "drizzle-orm";
import { usersTable } from "@db/schema/users";
import { catchDatabase, DatabaseResult, databaseError } from "@src/error/dbErrors";

export async function insertReciepts(reciepts: NewReciept[]): Promise<DatabaseResult<Reciept[]>> {
    return catchDatabase(() => {
        return database.transaction(async tx => {
            const selectResult = await tx
                .select({ exists: sql`1` })
                .from(usersTable)
                .where(inArray(usersTable.id, reciepts.map(r => r.userId)));
            if (selectResult.length !== reciepts.length) {
               throw databaseError("User creating recipt does not exist.");
            }
            const insertResult = await tx
                .insert(recieptsTable)
                .values(reciepts)
                .returning();
            return insertResult;
        });
    });
};

export async function paybackReciepts(recieptIds: RecieptId[]): Promise<DatabaseResult<Reciept[]>> {
    return catchDatabase(() => { 
        return database.transaction(async tx => {
            const updateResult = await database
                .update(recieptsTable)
                .set({ payBackDate: new Date() })
                .where(inArray(recieptsTable.id, recieptIds))
                .returning();
            if (updateResult.length !== recieptIds.length) {
                throw databaseError("Couldn't update, some id's didn't exist.")
            }
            return updateResult;
        })
    });
};

export async function selectRecipts(recieptIds: RecieptId[]): Promise<DatabaseResult<Reciept[]>> {
    return catchDatabase(() => {
        return database.transaction(async tx => {
            const selectResult = await tx
                .select()
                .from(recieptsTable)
                .where(inArray(recieptsTable.id, recieptIds))
            if (selectResult.length !== recieptIds.length) {
                throw databaseError("Couldn't select receipts, id's didn't exist.")
            }
            return selectResult;
        });
    });
}