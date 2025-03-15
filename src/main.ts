import "dotenv/config";
import {
	defaultErrorHandler,
	errorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";
import express from "express";

import { expensesRouter } from "@/src/routers/expenses";
import { customCors, customHelmetSecurity } from "@/src/security";

import { teamApplicationRouter } from "@/src/routers/team-applications";

import { openapiSpecification } from "@/src/openapi/config";
import { sponsorsRouter } from "@/src/routers/sponsors";
import { usersRouter } from "@/src/routers/users";
import openapiExpressHandler from "swagger-ui-express";
import { hostOptions } from "./enviroment";

export const api = express();

// Security
api.use(customHelmetSecurity);
api.disable("x-powered-by");
api.use(customCors());

// OpenAPI
api.use("/docs/api", openapiExpressHandler.serve);
api.get("/docs/api", openapiExpressHandler.setup(openapiSpecification));

api.use("", logger);

api.use("/expenses", expensesRouter);

api.use("/sponsors", sponsorsRouter);

api.use("/users", usersRouter);

api.use("/teamapplications", teamApplicationRouter);

api.use("", errorHandler);
api.use("", defaultErrorHandler);

api.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hostingUrl}. May need to specify port ${hostOptions.port}.`,
	);
});
