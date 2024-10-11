import { ErrorRequestHandler } from "express";
import { isHTTPError } from "@src/error/httpErrors";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(!isHTTPError(err)) {
        return next(err);
    }
    res.status(err.getErrorCode()).send(err.getResponseBodyJSON());
};

export const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.warn("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED. SOMETHING IS WRONG.");
    res.status(500).send("Unknown error.");
}