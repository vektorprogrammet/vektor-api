import { mainSchema } from "@/db/tables/schema";
import { usersTable } from "@/db/tables/users";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	numeric,
	serial,
	text,
} from "drizzle-orm/pg-core";

export const expensesTable = mainSchema.table("expenses", {
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
	isAccepted: boolean("isAccepted").default(true).notNull(),
	handlingDate: date("handlingDate", { mode: "date" }),
});

export const expensesRelations = relations(expensesTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [expensesTable.userId],
		references: [usersTable.id],
	}),
}));
