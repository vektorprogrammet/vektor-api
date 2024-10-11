import { z } from "zod";
import { RequestHandler } from "express";

const HTTPResponseSchema = z.record(z.any()).transform(sch => {
    return {
        data: sch,
    }
});


export const responseFormatter: RequestHandler = (req, res, next) => {
    const oldJson = res.json;
    
    res.json = function (data) {
        return oldJson.call(this, HTTPResponseSchema.parse(data));
    };
    next();
}