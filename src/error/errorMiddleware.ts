import { ErrorRequestHandler } from "express";
import { isCustomError } from "@src/error/errorTypes";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(!isCustomError(err)) {
        return next(err);
    }
    const response = err.getResponseBody();
    res.status(err.errorCode).send(response);
};

export const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED. SOMETHING IS WRONG.");
    res.status(500).send("Unknown error.");
}