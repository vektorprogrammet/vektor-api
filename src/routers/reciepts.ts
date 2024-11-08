import { paybackReciepts, selectRecipts } from "@src/db-access/reciepts";
import { clientError } from "@src/error/httpErrors";
import { Router, urlencoded } from "express";

import { recieptIdValidator } from "@src/request-handling/recieptHandling";

const recieptRouter = Router();

recieptRouter.use(urlencoded({ extended: true }));

/**
 * @openapi
 * /reciepts/payback/:
 *  put:
 *   description: Mark reciept as paid
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: "#/components/schemas/RecieptId"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/Reciept"
 */
recieptRouter.put("/payback", async (req, res, next) => {
	const paybackRequest = recieptIdValidator.safeParse(req.body);
	if (!paybackRequest.success) {
		return next(
			clientError(400, "Failed parsing paybackrequest", paybackRequest.error),
		);
	}
	const databaseResult = await paybackReciepts([paybackRequest.data.recieptId]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(paybackRequest.data);
});

/**
 * @openapi
 * /reciepts/:
 *  get:
 *   summar: Get reciept with id
 *   description: Get reciept with id
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: "#/components/schemas/RecieptId"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/Reciept"
 */
recieptRouter.get("/", async (req, res, next) => {
	const recieptRequest = recieptIdValidator.safeParse(req.body);
	if (!recieptRequest.success) {
		return next(clientError(400, "", recieptRequest.error));
	}
	const databaseResult = await selectRecipts([recieptRequest.data.recieptId]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

export default recieptRouter;
