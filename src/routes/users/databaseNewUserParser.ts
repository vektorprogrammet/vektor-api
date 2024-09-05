import { RequestHandler } from "express";
import { stringParser, integerParser } from "@src/parsing/typeParser";
import { ClientError } from "@src/error/errorTypes";

export const newUserParser: RequestHandler = (req, res, next) => {
    let query = req.query;
    let name;
    let age;
    try {
        name = stringParser(query["name"]);
        age = integerParser(query["age"]);
    } catch(e) {
        let clientError = new ClientError("Failed parsing user query.");
        clientError.cause = e;
        return next(clientError);
    }
    req.userQuery = {
        name,
        age,
    }
    next();
}