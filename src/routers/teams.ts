import { selectTeamApplicationsByTeamId } from "@src/db-access/team_applications";
import { selectTeamsById } from "@src/db-access/teams";
import { clientError } from "@src/error/httpErrors";
import {
	listQueryParser,
	toSerialIdParser,
} from "@src/request-handling/common";
import { Router, json } from "express";

export const teamsRouter = Router();
teamsRouter.use(json());

/**
 * @openapi
 * /teams/{teamId}/applications/:
 *  get:
 *   tags: [teams]
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
teamsRouter.get("/:teamID/applications/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamID);
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
 * /teams/{teamId}/:
 *  get:
 *   tags: [teams]
 *   summary: Get team with id
 *   description: Get team with id
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
teamsRouter.get("/:teamID/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamID);
	if (!teamIdResult.success) {
		return next(clientError(400, "", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(clientError(400, "", queryParametersResult.error));
	}
	const databaseResult = await selectTeamsById([teamIdResult.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});
