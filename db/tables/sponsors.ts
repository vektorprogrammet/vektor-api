import { relations } from "drizzle-orm";
import { date, integer, serial, text } from "drizzle-orm/pg-core";
import { departmentsTable } from "./departments";
import { mainSchema } from "./schema";

export const sponsorSizeEnum = mainSchema.enum("size", [
	"small",
	"medium",
	"large",
]);

export const sponsorsTable = mainSchema.table("sponsors", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	homePageUrl: text("homePageURL").notNull(),
	startDate: date("startDate", { mode: "date" }).notNull(),
	endDate: date("endDate", { mode: "date" }),
	size: sponsorSizeEnum("size").notNull(),
	spesificDepartmentId: integer("spesificDepartmentId").references(
		() => departmentsTable.id,
	),
});

export const sponsorsRelations = relations(sponsorsTable, ({ one }) => ({
	department: one(departmentsTable, {
		fields: [sponsorsTable.spesificDepartmentId],
		references: [departmentsTable.id],
	}),
}));
