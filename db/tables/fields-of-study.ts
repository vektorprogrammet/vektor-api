import { departmentsTable } from "@/db/tables/departments";
import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";
import { teamApplicationsTable } from "./team-applications";

export const fieldsOfStudyTable = mainSchema.table("fieldsOfStudy", {
	id: serial("id").primaryKey(),
	studyCode: text("studyCode").notNull().unique(),
	name: text("name").notNull().unique(),
	departmentId: integer("departmentId")
		.notNull()
		.references(() => departmentsTable.id),
});

export const fieldsOfStudyRelations = relations(
	fieldsOfStudyTable,
	({ one, many }) => ({
		department: one(departmentsTable, {
			fields: [fieldsOfStudyTable.departmentId],
			references: [departmentsTable.id],
		}),
		teamApplication: many(teamApplicationsTable),
	}),
);
