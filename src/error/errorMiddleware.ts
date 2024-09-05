import { ErrorRequestHandler } from "express";
import { ClientError, ServerError } from "./errorTypes";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(!(err instanceof ClientError) && !(err instanceof ServerError)) {
        return next();
    }
    res.status(err.errorCode).send(err.getResponseBody());
};

export const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED. SOMETHING IS WRONG.");
    res.status(500).send("Unknown error.");
}