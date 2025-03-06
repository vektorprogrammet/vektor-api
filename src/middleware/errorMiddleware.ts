import { isHTTPError } from "@src/error/httpErrors";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (!isHTTPError(err)) {
		return next(err);
	}
	res
		.status(err.getResponseCode())
		.json({ error: true, message: err.getResponseString() });
};

export const defaultErrorHandler: ErrorRequestHandler = (
	err,
	req,
	res,
	next,
) => {
	console.warn("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED.");
	res.status(500).json({ error: true, message: "Unknown error." });
};
