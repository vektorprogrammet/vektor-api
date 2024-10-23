import vektorSchema from "@db/schema/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { teamsTable } from "@db/schema/team";

export const teamApplicationsTable = vektorSchema.table("teamApplications", {
	id: serial("id").primaryKey(),
	teamId: integer("teamId")
		.notNull()
		.references(() => teamsTable.id),
	name: text("name").notNull(),
	email: text("email").notNull(),
	motivationText: text("motivationText").notNull(),
	fieldOfStudy: text("fieldOfStudy").notNull(),
	yearOfStudy: integer("yearOfStudy").notNull(),
	biography: text("biography").notNull(),
	phonenumber: text("phonenumber").notNull(),
});

export const teamApplicationsRelations = relations(
	teamApplicationsTable,
	({ one }) => ({
		team: one(teamsTable, {
			fields: [teamApplicationsTable.teamId],
			references: [teamsTable.id],
		}),
	}),
);

export type TeamApplication = typeof teamApplicationsTable.$inferSelect;
export type NewTeamApplication = typeof teamApplicationsTable.$inferInsert;
