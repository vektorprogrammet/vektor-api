import { mysqlTable, serial, text, int } from 'drizzle-orm/mysql-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const usersSchema = mysqlTable("users", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    age: int('age').notNull(),
});


export interface SelectUserInterface extends InferSelectModel<typeof usersSchema> {}
export interface InsertUserInterface extends InferInsertModel<typeof usersSchema> {}