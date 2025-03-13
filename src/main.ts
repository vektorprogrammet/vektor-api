import "dotenv/config";
import express from "express";

import { hostOptions } from "@/src/enviroment";
import {
	defaultErrorHandler,
	errorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";

import { expensesRouter } from "@/src/routers/expenses";
import { customCors, customHelmetSecurity } from "@/src/security";

import { teamApplicationRouter } from "@/src/routers/team-applications";

import { openapiSpecification } from "@/src/openapi/config";
import { sponsorsRouter } from "@/src/routers/sponsors";
import { usersRouter } from "@/src/routers/users";
import openapiExpressHandler from "swagger-ui-express";

export const vektorApi = express();

// Security
vektorApi.use(customHelmetSecurity);
vektorApi.disable("x-powered-by");
vektorApi.use(customCors());

// OpenAPI
vektorApi.use("/docs/api", openapiExpressHandler.serve);
vektorApi.get("/docs/api", openapiExpressHandler.setup(openapiSpecification));

vektorApi.use("", logger);

vektorApi.use("/expenses", expensesRouter);

vektorApi.use("/sponsors", sponsorsRouter);

vektorApi.use("/users", usersRouter);

vektorApi.use("/teamapplications", teamApplicationRouter);

vektorApi.use("", errorHandler);
vektorApi.use("", defaultErrorHandler);

vektorApi.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hostingUrl}. May need to specify port ${hostOptions.port}.`,
	);
});
