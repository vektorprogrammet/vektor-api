import { z } from "zod";
import { RequestHandler } from "express";

// From zod.dev (ggoodman)
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);


const HTTPResponseSchema = jsonSchema.transform(sch => {
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