import { boolean, date, serial, text } from "drizzle-orm/pg-core";
import schema from "@db/schema/schema";
import { integer } from "drizzle-orm/pg-core";
import { departmentsSchema } from "@db/schema/departments";
import { relations } from "drizzle-orm";

export const teamsTable = schema.table("teams", {
    id: serial('id').primaryKey(),
    departmentId: integer("departmentId").notNull().references(() => departmentsSchema.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    description: text("description").notNull(),
    shortDescription: text("shortDescription").notNull(),
    acceptApplication: boolean('acceptApplication').notNull(),
    active: boolean('active').notNull(),
    deadline: date("deadline", { mode: "date" }),
});

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
    department: one(departmentsSchema, {
        fields: [teamsTable.departmentId],
        references: [departmentsSchema.id],
    })
}));

export type Team = typeof teamsTable.$inferSelect;
export type NewTeam = typeof teamsTable.$inferInsert;