import { serial, text, integer } from 'drizzle-orm/pg-core';
import schema from '@db/schema/schema';

export const usersSchema = schema.table("users", {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text("lastName").notNull(),
    fieldOfStudyId: integer("fieldOfStudyId").notNull(),
});
export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
