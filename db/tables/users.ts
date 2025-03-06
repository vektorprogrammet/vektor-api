import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { expensesTable } from "@/db/tables/expenses";
import { fieldsOfStudyTable } from "@/db/tables/fields-of-study";
import { teamsTable } from "@/db/tables/teams";

export const usersTable = mainSchema.table("users", {
	id: serial("id").primaryKey(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	fieldOfStudyId: integer("fieldOfStudyId")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
	bankAccountNumber: text("accountNumber").unique(),
	personalEmail: text("personalEmail").notNull().unique(),
	phoneNumber: text("phoneNumber").notNull().unique(),
});
export const usersRelations = relations(usersTable, ({ one, many }) => ({
	fieldOfStudy: one(fieldsOfStudyTable, {
		fields: [usersTable.fieldOfStudyId],
		references: [fieldsOfStudyTable.id],
	}),
	expenses: many(expensesTable),
	teamUser: one(teamUsersTable),
	assistantUser: one(assistantUsersTable),
}));

export const teamUsersTable = mainSchema.table("teamUsers", {
	id: integer("id")
		.primaryKey()
		.references(() => usersTable.id),
	teamId: integer("teamId")
		.notNull()
		.references(() => teamsTable.id),
	username: text("username").notNull().unique(),
});
export const teamUsersRelations = relations(teamUsersTable, ({ one }) => ({
	superUser: one(usersTable, {
		fields: [teamUsersTable.id],
		references: [usersTable.id],
	}),
	team: one(teamsTable, {
		fields: [teamUsersTable.teamId],
		references: [teamsTable.id],
	}),
}));

export const assistantUsersTable = mainSchema.table("assistantUsers", {
	id: integer("id")
		.primaryKey()
		.references(() => usersTable.id),
});
export const assistantUsersRelation = relations(
	assistantUsersTable,
	({ one }) => ({
		superUser: one(usersTable, {
			fields: [assistantUsersTable.id],
			references: [usersTable.id],
		}),
	}),
);
