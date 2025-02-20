import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { expensesTable } from "@db/tables/expenses";

export const expensesSelectSchema = createSelectSchema(expensesTable).strict().readonly();

export type Expense = z.infer<typeof expensesSelectSchema>;
export type ExpenseKey = Expense["id"];
