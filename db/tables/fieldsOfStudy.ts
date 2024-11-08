import { departmentsTable } from "@db-tables/departments";
import vektorSchema from "@db-tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

export const fieldsOfStudyTable = vektorSchema.table("fieldsOfStudy", {
	id: serial("id").primaryKey(),
	studyCode: text("studyCode").notNull(),
	name: text("name").notNull(),
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
	}),
);
