import "dotenv/config";
import express from "express";

import { hostOptions } from "@src/enviroment";
import { defaultErrorHandler, errorHandler } from "@src/error/errorMiddleware";
import { logger } from "@src/logging/loggingMiddleware";

import outlayRouter from "@routes/outlays/main";

import { customCors, customHelmetSecurity } from "@src/security";
import recieptRouter from "./routes/reciepts/main";

const app = express();

// Security
app.use(customHelmetSecurity);
app.disable("x-powered-by");
app.use(customCors());

app.use("/", logger);

app.use("/outlays", outlayRouter);
app.use("/reciepts", recieptRouter);

app.use("/", errorHandler);
app.use("/", defaultErrorHandler);

app.listen(hostOptions.port, () => {
	if (hostOptions.publicURL !== undefined) {
		console.log(
			`Listening on public IP at ${hostOptions.publicURL}:${hostOptions.port}`,
		);
	}
	console.log(
		`Listening on private IP at ${hostOptions.privateURL}:${hostOptions.port}`,
	);
});
