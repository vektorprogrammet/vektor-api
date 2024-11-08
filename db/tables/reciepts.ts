import vektorSchema from "@db-tables/schema";
import { usersTable } from "@db-tables/users";
import { relations } from "drizzle-orm";
import { date, integer, numeric, serial, text } from "drizzle-orm/pg-core";

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
