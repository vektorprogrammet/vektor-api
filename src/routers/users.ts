import {
	insertAssistantUsers,
	insertTeamUsers,
	insertUsers,
	selectAssistantUsers,
	selectAssistantUsersById,
	selectTeamUsers,
	selectTeamUsersById,
	selectUsers,
	selectUsersById,
} from "@src/db-access/users";
import { clientError } from "@src/error/httpErrors";
import {
	toListQueryParser,
	toSerialIdParser,
} from "@src/request-handling/common";
import {
	assistantUserRequestToInsertParser,
	teamUserRequestToInsertParser,
	userRequestToInsertParser,
} from "@src/request-handling/users";
import { Router, json } from "express";

export const usersRouter = Router();
export const teamUsersRouter = Router();
export const assistantUsersRouter = Router();

usersRouter.use("/team-members", teamUsersRouter);
usersRouter.use("/assistants", assistantUsersRouter);

usersRouter.use(json());

/**
 * @openapi
 * /users/{id}:
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
usersRouter.get("/:userId", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "Invalid request format", userIdResult.error));
	}
	const databaseResult = await selectUsersById([userIdResult.data]);
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
 * /users/team-members/{id}:
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
teamUsersRouter.get("/:userId", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "Invalid request format", userIdResult.error));
	}
	const databaseResult = await selectTeamUsersById([userIdResult.data]);
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
 * /users/assistants/{id}/:
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
assistantUsersRouter.get("/:userId", async (req, res, next) => {
	const userIdResult = toSerialIdParser.safeParse(req.params.userId);
	if (!userIdResult.success) {
		return next(clientError(400, "Invalid request format", userIdResult.error));
	}
	const databaseResult = await selectAssistantUsersById([userIdResult.data]);
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
 * /users:
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
usersRouter.get("", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParameterResult.error),
		);
	}
	const databaseResult = await selectUsers(queryParameterResult.data);
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
 * /users/team-members:
 *  get:
 *   tags: [users]
 *   summary: Get team member users
 *   description: Get team member users
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
teamUsersRouter.get("", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParameterResult.error),
		);
	}
	const databaseResult = await selectTeamUsers(queryParameterResult.data);
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
 * /users/assistants:
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
assistantUsersRouter.get("", async (req, res, next) => {
	const queryParameterResult = toListQueryParser.safeParse(req.query);
	if (!queryParameterResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParameterResult.error),
		);
	}
	const databaseResult = await selectAssistantUsers(queryParameterResult.data);
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
 * /users:
 *  post:
 *   tags: [users]
 *   summary: Add new user
 *   description: Add new user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: "#/components/schemas/userRequest"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/user"
 */
usersRouter.post("", async (req, res, next) => {
	const newUserResult = userRequestToInsertParser.safeParse(req.body);
	if (!newUserResult.success) {
		return next(
			clientError(400, "Invalid request format", newUserResult.error),
		);
	}
	const databaseResult = await insertUsers([newUserResult.data]);
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
 * /users/team-members:
 *  post:
 *   tags: [users]
 *   summary: Add new team user, based on an existing user
 *   description: Add new team user, based on an existing user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: "#/components/schemas/teamUserRequest"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamUser"
 */
teamUsersRouter.post("", async (req, res, next) => {
	const newUserResult = teamUserRequestToInsertParser.safeParse(req.body);
	if (!newUserResult.success) {
		return next(
			clientError(400, "Invalid request format", newUserResult.error),
		);
	}
	const databaseResult = await insertTeamUsers([newUserResult.data]);
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
 * /users/assistants:
 *  post:
 *   tags: [users]
 *   summary: Add new assistant user, based on an existing user
 *   description: Add new assistant user, based on an existing user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: "#/components/schemas/assistantUserRequest"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/assistantUser"
 */
assistantUsersRouter.post("/assistants", async (req, res, next) => {
	const newUserResult = assistantUserRequestToInsertParser.safeParse(req.body);
	if (!newUserResult.success) {
		return next(
			clientError(400, "Invalid request format", newUserResult.error),
		);
	}
	const databaseResult = await insertAssistantUsers([newUserResult.data]);
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
