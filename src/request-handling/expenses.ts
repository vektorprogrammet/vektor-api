import { expensesTable } from "@/db/tables/expenses";
import {
	currencyParser,
	norwegianBankAccountNumberParser,
} from "@/lib/finance-parsers";
import { timeStringParser } from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenseRequestParser = z
	.object({
		userId: serialIdParser.describe("Id of user requesting expense"),
		title: z.string().min(1).describe("Title of expense"),
		moneyAmount: currencyParser.describe("Amount of money used"),
		description: z.string().min(1).describe("Description of expense"),
		bankAccountNumber: z
			.string()
			.length(11)
			.describe("Norwegian account number"),
		purchaseTime: timeStringParser.describe("Time of purcase"),
	})
	.strict();
export const expenseRequestToInsertParser = expenseRequestParser
	.extend({
		title: expenseRequestParser.shape.title.trim(),
		description: expenseRequestParser.shape.description.trim(),
		bankAccountNumber: expenseRequestParser.shape.bankAccountNumber.pipe(
			norwegianBankAccountNumberParser,
		),
		purchaseTime: expenseRequestParser.shape.purchaseTime.pipe(
			z.coerce.date().max(new Date()),
		),
	})
	.pipe(createInsertSchema(expensesTable).strict().readonly());

export type NewExpense = z.infer<typeof expenseRequestToInsertParser>;
