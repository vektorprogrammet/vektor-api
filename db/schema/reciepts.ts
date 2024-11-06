import vektorSchema from "@db/schema/schema";
import { usersTable } from "@db/schema/users";
import { relations } from "drizzle-orm";
import { date, integer, numeric, serial, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const recieptsTable = vektorSchema.table("reciepts", {
	id: serial("id").primaryKey(),
	userId: integer("userId")
		.notNull()
		.references(() => usersTable.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
	moneyAmount: numeric("moneyAmount", { scale: 2 }).notNull(),
	accountNumber: text("accountNumber").notNull(),
	purchaseDate: date("purchaseDate", { mode: "date" }).notNull(),
	submitDate: date("submitDate", { mode: "date" }).defaultNow().notNull(),
	payBackDate: date("payBackDate", { mode: "date" }),
});

export const reciptsRelations = relations(recieptsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [recieptsTable.userId],
		references: [usersTable.id],
	}),
}));

export type Reciept = typeof recieptsTable.$inferSelect;
export type NewReciept = typeof recieptsTable.$inferInsert;
export type RecieptId = Reciept["id"];

export const recieptPaybackSchema = z.object({
	recieptId: z.number().positive().finite().safe().int(),
});
