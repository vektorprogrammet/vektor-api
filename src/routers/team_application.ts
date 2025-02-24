import {
	insertTeamApplication,
	selectTeamApplications,
	selectTeamApplicationsByTeamId,
} from "@src/db-access/team_applications";
import { clientError } from "@src/error/httpErrors";
import { listQueryParser, serialIdParser } from "@src/request-handling/common";
import { teamApplicationToInsertParser } from "@src/request-handling/team_application";
import { Router, json } from "express";

export const teamApplicationRouter = Router();

teamApplicationRouter.use(json());

/**
 * @openapi
 * /teamapplications:
 *  get:
 *   tags: [teamapplications]
 *   summary: Get all teamapplications
 *   description: Get all teamapplications
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */

teamApplicationRouter.get("/", async (req, res, next) => {
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(clientError(400, "", queryParametersResult.error));
	}

	const results = await selectTeamApplications(queryParametersResult.data);
	if (!results.success) {
		return next(clientError(400, "Database error", results.error));
	}
	res.json(results.data);
});

/**
 * @openapi
 * /teamapplications/{teamId}/:
 *  get:
 *   tags: [teamapplications]
 *   summary: Get teamapplication with teamid
 *   description: Get teamapplication with teamid
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */
teamApplicationRouter.get("/:teamID/", async (req, res, next) => {
	const teamIdResult = serialIdParser.safeParse(req.params.teamID);
	if (!teamIdResult.success) {
		return next(clientError(400, "", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(clientError(400, "", queryParametersResult.error));
	}
	const databaseResult = await selectTeamApplicationsByTeamId(
		[teamIdResult.data],
		queryParametersResult.data,
	);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /teamapplications/:
 *  post:
 *   tags: [teamapplications]
 *   summary: Add teamapplication
 *   description: Add teamapplication
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/teamApplicationRequest"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */
teamApplicationRouter.post("/", async (req, res, next) => {
	const teamApplicationBodyResult = teamApplicationToInsertParser.safeParse(
		req.body,
	);
	if (!teamApplicationBodyResult.success) {
		const error = clientError(
			400,
			"Failed parsing teamapplication request.",
			teamApplicationBodyResult.error,
		);
		return next(error);
	}
	const databaseResult = await insertTeamApplication([
		teamApplicationBodyResult.data,
	]);
	if (!databaseResult.success) {
		const error = clientError(400, "Database error", databaseResult.error);
		return next(error);
	}
	res.status(201).json(databaseResult.data);
});
