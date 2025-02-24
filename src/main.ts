import "dotenv/config";
import express from "express";

import { hostOptions } from "@src/enviroment";
import {
	defaultErrorHandler,
	errorHandler,
} from "@src/middleware/errorMiddleware";
import { logger } from "@src/middleware/loggingMiddleware";

import { customCors, customHelmetSecurity } from "@src/security";
import { expenseRouter, expensesRouter } from "./routers/expense";

import { teamApplicationRouter } from "./routers/team_application";

import { openapiSpecification } from "@src/openapi/config";
import openapiExpressHandler from "swagger-ui-express";
import { usersRouter } from "./routers/users";

const app = express();

// Security
app.use(customHelmetSecurity);
app.disable("x-powered-by");
app.use(customCors());

// OpenAPI
app.use("/docs/api", openapiExpressHandler.serve);
app.get("/docs/api", openapiExpressHandler.setup(openapiSpecification));

app.use("/", logger);

app.use("/expense", expenseRouter);
app.use("/expenses", expensesRouter);

app.use("/users", usersRouter);

app.use("/teamapplications", teamApplicationRouter);

app.use("", errorHandler);
app.use("", defaultErrorHandler);

app.listen(hostOptions.port, () => {
	console.log(
		`Listening on ${hostOptions.hosting_url}. May need to specify port ${hostOptions.port}.`,
	);
});
