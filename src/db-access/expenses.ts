import { database } from "@db/setup/queryPostgres";
import { expensesTable } from "@db/tables/expenses";
import {
	type ORMResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { QueryParameters, datePeriod } from "@src/request-handling/common";
import type { NewExpense } from "@src/request-handling/expenses";
import type { Expense, ExpenseKey } from "@src/response-handling/expenses";
import {
	and,
	asc,
	between,
	desc,
	inArray,
	isNotNull,
	isNull,
	not,
	sum,
} from "drizzle-orm";

export async function insertExpenses(
	expenses: NewExpense[],
): Promise<ORMResult<Expense[]>> {
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
): Promise<ORMResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			const handledExpenses = await tx
				.select()
				.from(expensesTable)
				.where(
					and(
						isNotNull(expensesTable.handlingDate),
						inArray(expensesTable.id, expenseIds),
					),
				);
			if (handledExpenses.length !== 0) {
				throw ormError("Couldn't pay back expense, already handled.");
			}

			const updateResult = await database
				.update(expensesTable)
				.set({ handlingDate: new Date(), isAccepted: true })
				.where(inArray(expensesTable.id, expenseIds))
				.returning();
			if (updateResult.length !== expenseIds.length) {
				throw ormError("Couldn't update, some id's didn't exist.");
			}
			return updateResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function rejectExpense(
	expenseIds: ExpenseKey[],
): Promise<ORMResult<Expense[]>> {
	return database
		.transaction(async (tx) => {
			const handledExpenses = await tx
				.select()
				.from(expensesTable)
				.where(
					and(
						isNotNull(expensesTable.handlingDate),
						inArray(expensesTable.id, expenseIds),
					),
				);
			if (handledExpenses.length !== 0) {
				throw ormError("Couldn't reject expense, already handled.");
			}

			const updateResult = await database
				.update(expensesTable)
				.set({ handlingDate: new Date(), isAccepted: false })
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
): Promise<ORMResult<Expense[]>> {
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
): Promise<ORMResult<Expense[]>> {
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

export async function getSumUnprocessed(
	timePeriod: datePeriod,
): Promise<ORMResult<string>> {
	return database
		.transaction(async (tx) => {
			const unprocessedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(
					and(
						isNull(expensesTable.handlingDate),
						between(
							expensesTable.submitDate,
							timePeriod.startDate,
							timePeriod.endDate,
						),
					),
				);

			if (unprocessedExpences.length !== 1) {
				throw ormError("Invalid money numbers from database.");
			}

			const sumOfValues = unprocessedExpences[0];

			if (sumOfValues.value === null) {
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getSumAccepted(
	timePeriod: datePeriod,
): Promise<ORMResult<string>> {
	return database
		.transaction(async (tx) => {
			const acceptedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(
					and(
						expensesTable.isAccepted,
						isNotNull(expensesTable.handlingDate),
						between(
							expensesTable.submitDate,
							timePeriod.startDate,
							timePeriod.endDate,
						),
					),
				);

			if (acceptedExpences.length !== 1) {
				throw ormError("Invalid money numbers from database.");
			}

			const sumOfValues = acceptedExpences[0];

			if (sumOfValues.value === null) {
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getSumRejected(
	timePeriod: datePeriod,
): Promise<ORMResult<string>> {
	return database
		.transaction(async (tx) => {
			const rejectedExpences = await tx
				.select({ value: sum(expensesTable.moneyAmount) })
				.from(expensesTable)
				.where(
					and(
						not(expensesTable.isAccepted),
						isNotNull(expensesTable.handlingDate),
						between(
							expensesTable.submitDate,
							timePeriod.startDate,
							timePeriod.endDate,
						),
					),
				);

			if (rejectedExpences.length !== 1) {
				throw ormError("Invalid money numbers from database.");
			}

			const sumOfValues = rejectedExpences[0];

			if (sumOfValues.value === null) {
				// An empty database made sumOfValues.value null
				return "0";
			}

			return sumOfValues.value;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function getAveragePaybackTime(
	timePeriod: datePeriod,
): Promise<ORMResult<number>> {
	return database
		.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(expensesTable)
				.where(
					and(
						isNotNull(expensesTable.handlingDate),
						between(
							expensesTable.submitDate,
							timePeriod.startDate,
							timePeriod.endDate,
						),
					),
				);

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
