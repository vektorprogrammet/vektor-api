import { isHttpError } from "@/src/error/http-errors";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (!isHttpError(err)) {
		return next(err);
	}
	res
		.status(err.getResponseCode())
		.json({ error: true, message: err.getResponseString() });
};

export const defaultErrorHandler: ErrorRequestHandler = (
	_err,
	_req,
	res,
	_next,
) => {
	console.warn("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED.");
	res.status(500).json({ error: true, message: "Unknown error." });
};
