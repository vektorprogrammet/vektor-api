import { serial } from 'drizzle-orm/pg-core';
import { fieldsOfStudySchema } from '@db/schema/fieldsOfStudy';
import { relations } from 'drizzle-orm';
import schema from '@db/schema/schema';
import { teamsTable } from './team';

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

export const departmentsRelations = relations(departmentsSchema, ({ many }) => ({
  fieldsOfStudy: many(fieldsOfStudySchema),
  teams: many(teamsTable),

export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;
