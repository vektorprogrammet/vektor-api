import "dotenv/config";
import express from "express";

import { hostOptions } from "@/src/enviroment";
import {
	defaultErrorHandler,
	errorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";

import { customCors, customHelmetSecurity } from "@/src/security";
import { expenseRouter, expensesRouter } from "./routers/expenses";

import { teamApplicationRouter } from "./routers/team-applications";

import { openapiSpecification } from "@/src/openapi/config";
import openapiExpressHandler from "swagger-ui-express";
import { sponsorsRouter } from "./routers/sponsors";
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

app.use("/sponsors", sponsorsRouter);

app.use("/users", usersRouter);

app.use("/teamapplications", teamApplicationRouter);

app.use("", errorHandler);
app.use("", defaultErrorHandler);

app.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hosting_url}. May need to specify port ${hostOptions.port}.`,
	);
});
