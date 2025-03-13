import { mainSchema } from "@/db/tables/schema";
import { usersTable } from "@/db/tables/users";
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	numeric,
	serial,
	text,
	timestamp,
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
	purchaseTime: timestamp("purchaseTime").notNull(),
	submitTime: timestamp("submitTime").defaultNow().notNull(),
	isAccepted: boolean("isAccepted").default(true).notNull(),
	handlingTime: timestamp("handlingTime"),
});

export const expensesRelations = relations(expensesTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [expensesTable.userId],
		references: [usersTable.id],
	}),
}));
