import { recieptsTable } from "@db/schema/reciepts";
import { createInsertSchema } from "drizzle-zod";
import {
	isScaleTwoDecimalNumber,
	isValidNorwegiaAccountNumberNoIBAN,
} from "lib/moneyParser";

export const recieptInsertSchema = createInsertSchema(recieptsTable, {
	userId: (schema) => schema.userId.finite().safe().positive().int(),
	title: (schema) => schema.title.min(1),
	description: (schema) => schema.description.min(1),
	moneyAmount: (schema) =>
		schema.moneyAmount.trim().refine(isScaleTwoDecimalNumber, {
			message: "Not a scale 2 decimal number.",
		}),
	accountNumber: (schema) =>
		schema.accountNumber.refine(isValidNorwegiaAccountNumberNoIBAN),
	purchaseDate: (schema) => schema.purchaseDate.max(new Date()),
})
	.omit({
		id: true,
		submitDate: true,
		payBackDate: true,
	})
	.strict();
