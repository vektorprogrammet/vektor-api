import {
	selectAssistantUsers,
	selectAssistantUsersById,
	selectTeamUsers,
	selectTeamUsersById,
	selectUsers,
	selectUsersById,
} from "@src/db-access/users";
import { clientError } from "@src/error/httpErrors";
import { serialIdParser, toListQueryParser, toSerialIdParser } from "@src/request-handling/common";
import { Router } from "express";

export const userRouter = Router();
export const usersRouter = Router();

/**
 * @openapi
 * /user/{id}/:
 *  get:
 *   tags: [users]
 *   summary: Get user with id
 *   description: Get user with id
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/user"
 */
userRouter.get("/:userId/", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "", userIdResult.error));
	}
	const databaseResult = await selectUsersById([userIdResult.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /user/{id}/team:
 *  get:
 *   tags: [users]
 *   summary: Get teamuser with id
 *   description: Get teamuser with id
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamUser"
 */
userRouter.get("/:userId/team", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "", userIdResult.error));
	}
	const databaseResult = await selectTeamUsersById([userIdResult.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /user/{id}/assistant:
 *  get:
 *   tags: [users]
 *   summary: Get assistantuser with id
 *   description: Get assistantuser with id
 *   parameters:
 *    - $ref: "#/components/parameters/id"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/assistantUser"
 */
userRouter.get("/:userId/assistant", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "", userIdResult.error));
	}
	const databaseResult = await selectAssistantUsersById([userIdResult.data]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /users/:
 *  get:
 *   tags: [users]
 *   summary: Get users
 *   description: Get users
 *   parameters:
 *    - $ref: "#/components/parameters/limit"
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/sort"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/user"
 */
usersRouter.get("/", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(clientError(400, "", queryParameterResult.error));
	}
	const databaseResult = await selectUsers(queryParameterResult.data);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /users/team:
 *  get:
 *   tags: [users]
 *   summary: Get teamusers
 *   description: Get teamusers
 *   parameters:
 *    - $ref: "#/components/parameters/limit"
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/sort"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamUser"
 */
usersRouter.get("/team", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(clientError(400, "", queryParameterResult.error));
	}
	const databaseResult = await selectTeamUsers(queryParameterResult.data);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /users/assistant:
 *  get:
 *   tags: [users]
 *   summary: Get assistantusers
 *   description: Get assistantusers
 *   parameters:
 *    - $ref: "#/components/parameters/limit"
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/sort"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/assistantUser"
 */
usersRouter.get("/team", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(clientError(400, "", queryParameterResult.error));
	}
	const databaseResult = await selectAssistantUsers(queryParameterResult.data);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});