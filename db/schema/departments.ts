import { serial } from 'drizzle-orm/pg-core';
import { fieldsOfStudyTable } from '@db/schema/fieldsOfStudy';
import { relations } from 'drizzle-orm';
import { teamsTable } from '@db/schema/team';
import vektorSchema from '@db/schema/schema';

export const cities = vektorSchema.enum("city", [
	"Trondheim",
	"Ås",
	"Bergen",
	"Tromsø",
]);

export const departmentsTable = vektorSchema.table("departments", {
	id: serial("id").primaryKey(),
	city: cities("city").notNull(),
});

export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
	fieldsOfStudy: many(fieldsOfStudyTable),
	teams: many(teamsTable),
}))
export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;
