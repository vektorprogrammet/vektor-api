import { insertSponsors, selectSponsorsById } from "@/src/db-access/sponsors";
import { clientError } from "@/src/error/http-errors";
import { toSerialIdParser } from "@/src/request-handling/common";
import { sponsorRequestToInsertParser } from "@/src/request-handling/sponsors";
import { Router, json } from "express";

export const sponsorsRouter = Router();
sponsorsRouter.use(json());

/**
 * @openapi
 * /sponsors/:
 *  post:
 *   tags: [sponsors]
 *   summary: Add sponsor
 *   description: Add sponsor
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/sponsorRequest"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/sponsor"
 */
sponsorsRouter.post("/", async (req, res, next) => {
	const sponsorRequest = sponsorRequestToInsertParser.safeParse(req.body);
	if (!sponsorRequest.success) {
		const error = clientError(
			400,
			"Invalid request format",
			sponsorRequest.error,
		);
		return next(error);
	}
	const databaseResult = await insertSponsors([sponsorRequest.data]);
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

/**
 * @openapi
 * /sponsors/{id}/:
 *  get:
 *   tags: [sponsors]
 *   summary: Get sponsor with id
 *   description: Get sponsor with id
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/sponsor"
 */
sponsorsRouter.get("/:sponsorId", async (req, res, next) => {
	const sponsorIdResult = toSerialIdParser.safeParse(req.params.sponsorId);
	if (!sponsorIdResult.success) {
		return next(
			clientError(400, "Invalid request format", sponsorIdResult.error),
		);
	}
	const databaseResult = await selectSponsorsById([sponsorIdResult.data]);
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
