import {
	getAveragePaybackTime,
	getSumAccepted,
	getSumRejected,
	getSumUnprocessed,
	insertExpenses,
	paybackExpenses,
	selectExpenses,
	selectExpensesById,
} from "@src/db-access/expenses";
import { clientError } from "@src/error/httpErrors";
import {
	toListQueryParser,
	toSerialIdParser,
} from "@src/request-handling/common";
import { expenseRequestToInsertParser } from "@src/request-handling/expenses";
import { Router, urlencoded } from "express";

export const expenseRouter = Router();
export const expensesRouter = Router();
expenseRouter.use(urlencoded({ extended: true }));

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
 *     application/x-www-form-urlencoded:
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
			"Failed parsing expenserequest.",
			expenseRequest.error,
		);
		return next(error);
	}
	const databaseResult = await insertExpenses([expenseRequest.data]);
	if (!databaseResult.success) {
		const error = clientError(400, "Database error", databaseResult.error);
		return next(error);
	}
	res.status(201).json(expenseRequest.data);
});

expensesRouter.use(urlencoded({ extended: true }));

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
			clientError(400, "Failed parsing paybackrequest", paybackRequest.error),
		);
	}
	const databaseResult = await paybackExpenses([paybackRequest.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(paybackRequest.data);
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
		return next(clientError(400, "", expenseIdResult.error));
	}
	const databaseResult = await selectExpensesById([expenseIdResult.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
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
		return next(clientError(400, "", queryParametersResult.error));
	}
	const databaseResult = await selectExpenses(queryParametersResult.data);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/unprocessed/:
 *  get:
 *   tags: [expenses]
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
	const databaseResult = await getSumUnprocessed();
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/accepted/:
 *  get:
 *   tags: [expenses]
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
	const databaseResult = await getSumAccepted();
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/money-amount/rejected/:
 *  get:
 *   tags: [expenses]
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
	const databaseResult = await getSumRejected();
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /expenses/payback-time/average/:
 *  get:
 *   tags: [expenses]
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
	const databaseResult = await getAveragePaybackTime();
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});
