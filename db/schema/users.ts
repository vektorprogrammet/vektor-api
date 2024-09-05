import { mysqlTable, serial, text, int } from 'drizzle-orm/mysql-core';

export const usersSchema = mysqlTable("users", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    age: int('age').notNull(),
});
export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
