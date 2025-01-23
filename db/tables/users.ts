import mainSchema from "@db/tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { expensesTable } from "@db/tables/expenses";
import { fieldsOfStudyTable } from "@db/tables/fieldsOfStudy";

export const usersTable = mainSchema.table("users", {
	id: serial("id").primaryKey(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	fieldOfStudyId: integer("fieldOfStudyId")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	fieldOfStudy: one(fieldsOfStudyTable, {
		fields: [usersTable.fieldOfStudyId],
		references: [fieldsOfStudyTable.id],
	}),
	expenses: many(expensesTable),
}));
