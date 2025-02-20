import { expensesTable } from "@db/tables/expenses";
import {
	currencyParser,
	norwegianBankAccountNumberParser,
} from "@lib/financeParsers";
import { serialIdParser } from "@src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenseRequestParser = z
	.object({
		userId: serialIdParser.describe("Id of user requesting expense"),
		title: z.string().nonempty().describe("Title of expense"),
		moneyAmount: currencyParser.describe("Amount of money used"),
		description: z.string().nonempty().describe("Description of expense"),
		bankAccountNumber: z
			.string()
			.length(11)
			.describe("Norwegian account number"),
		purchaseDate: z
			.string()
			.date("Must be valid datestring (YYYY-MM-DD)")
			.describe("Date of purcase"),
	})
	.strict();
export const expenseRequestToInsertParser = expenseRequestParser
	.extend({
		title: expenseRequestParser.shape.title.trim(),
		description: expenseRequestParser.shape.description.trim(),
		bankAccountNumber: expenseRequestParser.shape.bankAccountNumber.pipe(
			norwegianBankAccountNumberParser,
		),
		purchaseDate: expenseRequestParser.shape.purchaseDate.pipe(z.coerce.date()),
	})
	.pipe(createInsertSchema(expensesTable).strict().readonly());

export type NewExpense = z.infer<typeof expenseRequestToInsertParser>;
type foo = NewExpense["handlingDate"];
