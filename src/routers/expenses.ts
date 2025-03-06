import {
	getAveragePaybackTime,
	getSumAccepted,
	getSumRejected,
	getSumUnprocessed,
	insertExpenses,
	paybackExpenses,
	rejectExpense,
	selectExpenses,
	selectExpensesById,
} from "@/src/db-access/expenses";
import { clientError } from "@/src/error/http-errors";
import {
	toDatePeriodParser,
	toListQueryParser,
	toSerialIdParser,
} from "@/src/request-handling/common";
import { expenseRequestToInsertParser } from "@/src/request-handling/expenses";
import { Router, json } from "express";

export const expenseRouter = Router();
export const expensesRouter = Router();
expenseRouter.use(json());

/**
 * @openapi
 * /expense/:
 *  post:
 *   tags: [expenses]
 *   summary: Add expense
 *   description: Add expense
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/expenseRequest"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/expense"
 */
expenseRouter.post("/", async (req, res, next) => {
	const expenseRequest = expenseRequestToInsertParser.safeParse(req.body);
	if (!expenseRequest.success) {
		const error = clientError(
			400,
			"Invalid request format",
			expenseRequest.error,
		);
		return next(error);
	}
	const databaseResult = await insertExpenses([expenseRequest.data]);
	if (!databaseResult.success) {
		const error = clientError(
			400,
			"Failed to execute the database command",
			databaseResult.error,
		);
		return next(error);
	}
	res.status(201).json(databaseResult.data);
});

expensesRouter.use(json());

/**
 * @openapi
 * /expense/{id}/payback/:
 *  put:
 *   tags: [expenses]
 *   summary: Payback expense with ID
 *   description: Payback expense with ID
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/expense"
 */
expenseRouter.put("/:id/payback/", async (req, res, next) => {
	const paybackRequest = toSerialIdParser.safeParse(req.params.id);
	if (!paybackRequest.success) {
		return next(
			clientError(400, "Invalid request format", paybackRequest.error),
		);
	}
	const databaseResult = await paybackExpenses([paybackRequest.data]);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
	}
	res.json(paybackRequest.data);
});

/**
 * @openapi
 * /expense/{id}/reject/:
 *  put:
 *   tags: [expenses]
 *   summary: Reject expense with ID
 *   description: Reject expense with ID
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/expense"
 */
expenseRouter.put("/:id/reject/", async (req, res, next) => {
	const rejectRequest = toSerialIdParser.safeParse(req.params.id);
	if (!rejectRequest.success) {
		return next(
			clientError(400, "Invalid request format", rejectRequest.error),
		);
	}
	const databaseResult = await rejectExpense([rejectRequest.data]);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
	}
	res.json(rejectRequest.data);
});

/**
 * @openapi
 * /expense/{id}/:
 *  get:
 *   tags: [expenses]
 *   summary: Get expense with id
 *   description: Get expense with id
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/expense"
 */
expenseRouter.get("/:expenseId/", async (req, res, next) => {
	const expenseIdResult = toSerialIdParser.safeParse(req.params.expenseId);
	if (!expenseIdResult.success) {
		return next(
			clientError(400, "Invalid request format", expenseIdResult.error),
		);
	}
	const databaseResult = await selectExpensesById([expenseIdResult.data]);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/:
 *  get:
 *   tags: [expenses]
 *   summary: Get expenses
 *   description: Get expenses
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *    - $ref: "#/components/parameters/sort"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/expense"
 */
expensesRouter.get("/", async (req, res, next) => {
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectExpenses(queryParametersResult.data);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/unprocessed/:
 *  get:
 *   tags: [expenses]
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/datePeriod"
 *   summary: Get total money amount of unprocessed expences
 *   description: Get total money amount of unprocessed expences
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 */
expensesRouter.get("/money-amount/unprocessed/", async (req, res, next) => {
	const bodyParameterResult = toDatePeriodParser.safeParse(req.body);
	if (!bodyParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", bodyParameterResult.error),
		);
	}
	const databaseResult = await getSumUnprocessed(bodyParameterResult.data);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/accepted/:
 *  get:
 *   tags: [expenses]
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/datePeriod"
 *   summary: Get total money amount of accepted expences
 *   description: Get total money amount of accepted expences
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 */
expensesRouter.get("/money-amount/accepted/", async (req, res, next) => {
	const bodyParameterResult = toDatePeriodParser.safeParse(req.body);
	if (!bodyParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", bodyParameterResult.error),
		);
	}
	const databaseResult = await getSumAccepted(bodyParameterResult.data);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/rejected/:
 *  get:
 *   tags: [expenses]
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/datePeriod"
 *   summary: Get total money amount of rejected expences
 *   description: Get total money amount of rejected expences
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 */
expensesRouter.get("/money-amount/rejected/", async (req, res, next) => {
	const bodyParameterResult = toDatePeriodParser.safeParse(req.body);
	if (!bodyParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", bodyParameterResult.error),
		);
	}
	const databaseResult = await getSumRejected(bodyParameterResult.data);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/payback-time/average/:
 *  get:
 *   tags: [expenses]
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/datePeriod"
 *   summary: Get average time for expences to get handled
 *   description: Get average time for expences to get paid handled
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 */
expensesRouter.get("/payback-time/average/", async (req, res, next) => {
	const bodyParameterResult = toDatePeriodParser.safeParse(req.body);
	if (!bodyParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", bodyParameterResult.error),
		);
	}
	const databaseResult = await getAveragePaybackTime(bodyParameterResult.data);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});
