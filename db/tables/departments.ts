import { fieldsOfStudyTable } from "@db/tables/fieldsOfStudy";
import mainSchema from "@db/tables/schema";
import { teamsTable } from "@db/tables/team";
import { relations } from "drizzle-orm";
import { serial } from "drizzle-orm/pg-core";

export const citiesEnum = mainSchema.enum("city", [
	"Trondheim",
	"Ås",
	"Bergen",
	"Tromsø",
]);

export const departmentsTable = mainSchema.table("departments", {
	id: serial("id").primaryKey(),
	city: citiesEnum("city").notNull(),
});

export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
	fieldsOfStudy: many(fieldsOfStudyTable),
	teams: many(teamsTable),
}));
