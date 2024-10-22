import { boolean, date, serial, text } from "drizzle-orm/pg-core";
import vektorSchema from "@db/schema/schema";
import { integer } from "drizzle-orm/pg-core";
import { departmentsTable } from "@db/schema/departments";
import { relations } from "drizzle-orm";
import { teamApplicationsTable } from "@db/schema/teamApplication";

export const teamsTable = vektorSchema.table("teams", {
    id: serial('id').primaryKey(),
    departmentId: integer("departmentId").notNull().references(() => departmentsTable.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    description: text("description").notNull(),
    shortDescription: text("shortDescription").notNull(),
    acceptApplication: boolean('acceptApplication').notNull(),
    active: boolean('active').notNull(),
    deadline: date("deadline", { mode: "date" }),
});

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
    department: one(departmentsTable, {
        fields: [teamsTable.departmentId],
        references: [departmentsTable.id],
    }),
    teamApplication: many(teamApplicationsTable)
}));

export type Team = typeof teamsTable.$inferSelect;
export type NewTeam = typeof teamsTable.$inferInsert;