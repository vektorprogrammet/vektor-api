import { insertReciepts } from "@src/db-access/reciepts";
import { clientError } from "@src/error/httpErrors";
import { outlayRequestTransformer } from "@src/request-handling/outlayHandling";
import { Router, urlencoded } from "express";

const outlayRouter = Router();

outlayRouter.use(urlencoded({ extended: true }));

/**
 * @openapi
 * outlays:
 *  post:
 *   description: Legg til utlegg
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: "#/components/schemas/OutlayRequest"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/Reciept"
 */
outlayRouter.post("/", async (req, res, next) => {
	const outlayRequest = outlayRequestTransformer.safeParse(req.body);
	if (!outlayRequest.success) {
		const error = clientError(
			400,
			"Failed parsing outlayrequest.",
			outlayRequest.error,
		);
		return next(error);
	}
	const databaseResult = await insertReciepts([outlayRequest.data]);
	if (!databaseResult.success) {
		const error = clientError(400, "Database error", databaseResult.error);
		return next(error);
	}
	res.status(201).json(outlayRequest.data);
});

export default outlayRouter;
