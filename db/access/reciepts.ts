import { database } from "@db/setup/queryPostgres";
import { recieptsSchema, NewReciept } from "@db/schema/reciepts";

export const insertReciepts = async (reciepts: NewReciept[]) => {
    await database
        .insert(recieptsSchema)
        .values(reciepts);
};