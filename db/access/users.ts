import {database} from "@db/setup/queryMysql";
import {usersSchema, User, NewUser } from "@db/schema/users";
import {eq} from "drizzle-orm";

export const getUsersFromId = async (id: number): Promise<User[]> => {
    return database
        .select()
        .from(usersSchema)
        .where(eq(usersSchema.id, id));
};
export const insertUsers = async (users: NewUser[]) => {
    await database
        .insert(usersSchema)
        .values(users);
};