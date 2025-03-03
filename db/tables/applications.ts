import mainSchema from "@db/tables/schema";
import { relations } from "drizzle-orm";
import { date, integer, serial, text } from "drizzle-orm/pg-core";

import { teamsTable } from "@db/tables/team";
import { fieldsOfStudyTable } from "./fieldsOfStudy";

export const genders = mainSchema.enum("gender", [
	"Female",
	"Male",
	"Other",
]);

export const applicationsTable = mainSchema.table("applications", {
	id: serial("id").primaryKey(),
	firstname: text("name").notNull(),
	lastname: text("name").notNull(),
	gender: genders("gender").notNull(),
	email: text("email").notNull(),
	fieldOfStudyId: integer("fieldOfStudyId")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
	yearOfStudy: integer("yearOfStudy").notNull(),
	phonenumber: text("phonenumber").notNull(),
	submitDate: date("submitDate", { mode: "date" }).defaultNow().notNull(),
});

export const applicationsRelations = relations(
	applicationsTable,
	({ one }) => ({	
		fieldOfStudy: one(fieldsOfStudyTable, {
			fields: [applicationsTable.fieldOfStudyId],
			references: [fieldsOfStudyTable.id],
		}),
	}),
);

export const teamApplicationsTable = mainSchema.table("teamApplications", {
	id: integer("id")
	.primaryKey()
	.references(() => applicationsTable.id),
	teamId: integer("teamId")
	.notNull()
	.references(() => teamsTable.id),
	motivationText: text("motivationText").notNull(),
	biography: text("biography").notNull(),
})

export const teamApplicationsRelations = relations(
	teamApplicationsTable, ({ one }) => ({
		superApplication: one( applicationsTable,{
			fields: [teamApplicationsTable.id],
			references: [applicationsTable.id]
		}),
		team: one(teamsTable, {
			fields: [teamApplicationsTable.teamId],
			references: [teamsTable.id],
		}),
	})
)

export const assistantApplicationsTable = mainSchema.table("assistantApplications", {
	id: integer("id")
	.primaryKey()
	.references(() => applicationsTable.id) 
})

export const assistantApplicationsRelations = relations(
	assistantApplicationsTable, ({ one }) => ({
		superApplication: one( applicationsTable,{
			fields: [assistantApplicationsTable.id],
			references: [applicationsTable.id]
		})
	})
)


