import { expensesTable } from "@db/tables/expenses";
import { isScaleTwoSerial } from "@lib/moneyParser";
import { isValidNorwegiaAccountNumberNoIBAN } from "@lib/moneyParser";
import { keySchema } from "@src/db-validation/common";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const expenseInsertSchema = createInsertSchema(expensesTable, {
	userId: (schema) => schema.userId.refine((id) => keySchema.parse(id)),
	title: (schema) => schema.title.min(1),
	description: (schema) => schema.description.min(1),
	moneyAmount: (schema) =>
		schema.moneyAmount.trim().refine(isScaleTwoSerial, {
			message: "Not a scale 2 decimal number.",
		}),
	accountNumber: (schema) =>
		schema.accountNumber.refine(isValidNorwegiaAccountNumberNoIBAN),
	purchaseDate: (schema) => schema.purchaseDate.max(new Date()),
}).omit({
	id: true,
	submitDate: true,
	handlingDate: true,
});

export type NewExpense = z.infer<typeof expenseInsertSchema>;
