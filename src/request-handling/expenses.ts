import { ceilToTwoDecimals } from "@lib/moneyParser";
import { removeSeparatorsNorwegianAccountNumberNoIBAN } from "@lib/moneyParser";
import { z } from "zod";

export const expenseRequestValidator = z.object({
	userId: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.describe("Id of user requesting expense"),
	title: z.string().min(1).describe("Title of expense"),
	moneyAmount: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.describe("Amount of money used"),
	description: z.string().min(1).describe("Description of expense"),
	accountNumber: z.string().min(11).describe("Norwegian account number"),
	purchaseDate: z
		.string()
		.date("Must be valid datestring (YYYY-MM-DD)")
		.describe("Date of purcase"),
});
export const expenseRequestTransformer = expenseRequestValidator.transform(
	(schema, ctx) => {
		return {
			userId: schema.userId,
			title: schema.title.trim(),
			moneyAmount: (() => {
				const result = ceilToTwoDecimals(schema.moneyAmount);
				if (result.success) {
					return String(result.data);
				}
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: result.error.message,
				});
				return z.NEVER;
			})(),
			description: schema.description.trim(),
			accountNumber: (() => {
				try {
					return removeSeparatorsNorwegianAccountNumberNoIBAN(
						schema.accountNumber,
					);
				} catch (e) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: (e as Error).message,
					});
					return z.NEVER;
				}
			})(),
			purchaseDate: (() => {
				return new Date(schema.purchaseDate);
			})(),
		};
	},
);
