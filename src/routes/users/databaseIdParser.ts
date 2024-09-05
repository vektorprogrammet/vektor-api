import { RequestHandler } from "express";
import { ClientError } from "@src/error/errorTypes";
import { integerParser } from "@src/parsing/typeParser";

export const idParser: RequestHandler = (req, res, next) => {
    let query = req.query;
    let id;
    try {
        id = integerParser(query["id"]);
    } catch(e) {
        let clientError = new ClientError("Id query is malformed.");
        clientError.cause = e;
        return next(clientError);
    }
    if (id < 0) {
        throw new ClientError("Id cannot be less than zero.");
    }
    req.idQuery = id;
    next();
}