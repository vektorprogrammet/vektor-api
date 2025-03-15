import { departmentsTable } from "@/db/tables/departments";
import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text, timestamp } from "drizzle-orm/pg-core";

export const sponsorSizeEnum = mainSchema.enum("size", [
	"small",
	"medium",
	"large",
]);

export const sponsorsTable = mainSchema.table("sponsors", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	homePageUrl: text("homePageURL").notNull(),
	startTime: timestamp("startTime").notNull(),
	endTime: timestamp("endTime"),
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
