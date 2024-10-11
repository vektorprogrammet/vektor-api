import { database } from "@db/setup/queryPostgres";
import { recieptsSchema, NewReciept, RecieptId, Reciept } from "@db/schema/reciepts";
import { sql, inArray } from "drizzle-orm";
import { usersSchema } from "@db/schema/users";
import { catchDatabase, DatabaseResult, databaseError } from "@src/error/dbErrors";

export async function insertReciepts(reciepts: NewReciept[]): Promise<DatabaseResult<Reciept[]>> {
    return catchDatabase(() => {
        return database.transaction(async tx => {
            const selectResult = await tx
                .select({ exists: sql`1` })
                .from(usersSchema)
                .where(inArray(usersSchema.id, reciepts.map(r => r.userId)));
            if (selectResult.length !== reciepts.length) {
               throw databaseError("User creating recipt does not exist.");
            }
            const insertResult = await tx
                .insert(recieptsSchema)
                .values(reciepts)
                .returning();
            return insertResult;
        });
    });
};

export async function paybackReciepts(reciptIds: RecieptId[]): Promise<DatabaseResult<Reciept[]>> {
    return catchDatabase(() => { 
        return database.transaction(async tx => {
            const updateResult = await database
                .update(recieptsSchema)
                .set({ payBackDate: new Date() })
                .where(inArray(recieptsSchema.id, reciptIds))
                .returning();
            if (updateResult.length !== reciptIds.length) {
                throw databaseError("Couldn't update, some id's didn't exist.")
            }
            return updateResult;
        })
    });
};