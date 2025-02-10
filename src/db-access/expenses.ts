import { database } from "@db/setup/queryPostgres";
import { expensesTable } from "@db/tables/expenses";
import { usersTable } from "@db/tables/users";
import type { NewExpense } from "@src/db-validation/expenses";
import {
	type DatabaseResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { QueryParameters } from "@src/request-handling/common";
import type { Expense, ExpenseKey } from "@src/response-handling/expenses";
import {
	and,
	asc,
	desc,
	inArray,
	isNotNull,
	isNull,
	not,
	sum,
	avg,
} from "drizzle-orm";
import { z } from "zod";

export async function insertExpenses(
	expenses: NewExpense[],
): Promise<DatabaseResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			const insertResult = await tx
				.insert(expensesTable)
				.values(expenses)
				.returning();
			return insertResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function paybackExpenses(
	expenseIds: ExpenseKey[],
): Promise<DatabaseResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			const updateResult = await database
				.update(expensesTable)
				.set({ handlingDate: new Date() })
				.where(inArray(expensesTable.id, expenseIds))
				.returning();
			if (updateResult.length !== expenseIds.length) {
				throw ormError("Couldn't update, some id's didn't exist.");
			}
			return updateResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectExpensesById(
	expenseIds: ExpenseKey[],
): Promise<DatabaseResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			const selectResult = await tx
				.select()
				.from(expensesTable)
				.where(inArray(expensesTable.id, expenseIds));
			if (selectResult.length !== expenseIds.length) {
				throw ormError("Couldn't select expenses, id's didn't exist.");
			}
			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectExpenses(
	parameters: QueryParameters,
): Promise<DatabaseResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			let selectResult: Promise<Expense[]>;
			if (parameters.sort === "asc") {
				selectResult = tx
					.select()
					.from(expensesTable)
					.limit(parameters.limit)
					.offset(parameters.offset)
					.orderBy(asc(expensesTable.submitDate));
			} else {
				selectResult = tx
					.select()
					.from(expensesTable)
					.limit(parameters.limit)
					.offset(parameters.offset)
					.orderBy(desc(expensesTable.submitDate));
			}
			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getSumUnprocessed(): Promise<DatabaseResult<string>> {
	return database
		.transaction(async (tx) => {
			const unprocessedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(isNull(expensesTable.handlingDate));

			if (unprocessedExpences.length != 1) {
				throw ormError("Invalid money numbers from database.");
			}

			let sumOfValues = unprocessedExpences[0];

			if (sumOfValues.value === null){
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getSumAccepted(): Promise<DatabaseResult<string>> {
	return database
		.transaction(async (tx) => {
			const acceptedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(and(expensesTable.isAccepted, isNotNull(expensesTable.handlingDate)));

			if (acceptedExpences.length != 1) {
				throw ormError("Invalid money numbers from database.");
			}

			let sumOfValues = acceptedExpences[0];

			if (sumOfValues.value === null){
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getSumRejected(): Promise<DatabaseResult<string>> {
	return database
		.transaction(async (tx) => {
			const rejectedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(and(not(expensesTable.isAccepted), isNotNull(expensesTable.handlingDate)));

			if (rejectedExpences.length != 1) {
				throw ormError("Invalid money numbers from database.");
			}

			let sumOfValues = rejectedExpences[0];

			if (sumOfValues.value === null){
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getAveragePaybackTime(): Promise<DatabaseResult<number>> {
	return database
		.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(expensesTable)
				.where(isNotNull(expensesTable.handlingDate));

			if (result.length === 0) {
				return 0;
			}

			const totalMilliseconds = result.reduce((accumulator, currentValue) => {
				// handlingDate have already checked not to be null
				const handlingDate = currentValue.handlingDate as Date;

				return (
					accumulator +
					(handlingDate.getTime() - currentValue.submitDate.getTime())
				);
			}, 0);

			return totalMilliseconds / result.length;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
