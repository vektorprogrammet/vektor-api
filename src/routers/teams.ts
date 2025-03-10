import { selectTeamApplicationsByTeamId } from "@/src/db-access/team-applications";
import { selectTeamsById } from "@/src/db-access/teams";
import { clientError } from "@/src/error/http-errors";
import {
	listQueryParser,
	toSerialIdParser,
} from "@/src/request-handling/common";
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
teamsRouter.get("/:teamId/applications/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamId);
	if (!teamIdResult.success) {
		return next(clientError(400, "Invalid request format", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectTeamApplicationsByTeamId(
		[teamIdResult.data],
		queryParametersResult.data,
	);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
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
teamsRouter.get("/:teamId/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamId);
	if (!teamIdResult.success) {
		return next(clientError(400, "Invalid request format", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectTeamsById([teamIdResult.data]);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});
