import { recieptsTable } from "@db-tables/reciepts";
import { keySchema } from "@db-validation/common";
import { isScaleTwoSerial } from "@lib/moneyParser";
import { isValidNorwegiaAccountNumberNoIBAN } from "@lib/moneyParser";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const recieptInsertSchema = createInsertSchema(recieptsTable, {
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
	payBackDate: true,
});

export type NewReciept = z.infer<typeof recieptInsertSchema>;
