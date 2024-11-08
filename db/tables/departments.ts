import { fieldsOfStudyTable } from "@db/tables/fieldsOfStudy";
import vektorSchema from "@db/tables/schema";
import { teamsTable } from "@db/tables/team";
import { relations } from "drizzle-orm";
import { serial } from "drizzle-orm/pg-core";

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
}));
