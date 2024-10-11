import { clientError } from "@src/error/httpErrors";
import { parseMoneyToTwoDecimals, removeSeparatorsNorwegianAccountNumberNoIBAN} from "@src/parsing/moneyParser"
import { Router, urlencoded } from "express"
import { z } from "zod";
import { recieptInsertSchema, recieptPaybackSchema } from "@db/schema/reciepts";
import { insertReciepts, paybackReciepts } from "@db/access/reciepts"

const outlayRouter = Router();

const outlayRequestSchema = z.object({
    userId: z.string().transform((numString) => {return Number(numString);}),
    title: z.string().trim(),
    moneyAmount: z.string().transform((money, ctx) => {
        try {
            return parseMoneyToTwoDecimals(money);
        } catch(e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: (e as Error).message,
            });
            return z.NEVER;
        }
    }),
    description: z.string().trim(),
    accountNumber: z.string().trim().transform((accountNumber, ctx) => {
        try {
            return removeSeparatorsNorwegianAccountNumberNoIBAN(accountNumber);
        } catch(e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: (e as Error).message,
            });
            return z.NEVER;
        }
    }),
    purchaseDate: z.string().date("Must be a valid ISO date format. (YYYY-MM-DD)").transform((dateString) => {
        return new Date(dateString);
    }),
}).pipe(recieptInsertSchema);

outlayRouter.use(urlencoded({ extended: true }));

outlayRouter.post("/new", async (req, res, next) => {
    const outlayRequest = outlayRequestSchema.safeParse(req.body);
    if(!outlayRequest.success) {
        const error = clientError(400, "Failed parsing outlayrequest.", outlayRequest.error);
        return next(error);
    }
    const databaseResult = await insertReciepts([outlayRequest.data]);
    if (!databaseResult.success) {
        const error = clientError(403, "Database error", databaseResult.error)
        return next(error);
    }
    console.log(outlayRequest.data);
    res.json(outlayRequest.data);
});

const outlayPaybackSchema = z.object({
    recieptId: z.string().transform((numString) => {return Number(numString)}),
}).pipe(recieptPaybackSchema);

outlayRouter.put("/payback", async (req, res, next) => {
    let paybackRequest = outlayPaybackSchema.safeParse(req.body);
    if (!paybackRequest.success) {
        const error = clientError(400, "Failed parsing paybackrequest", paybackRequest.error);
        return next(error);
    }
    let databaseResult = await paybackReciepts([paybackRequest.data.recieptId]);
    if (!databaseResult.success) {
        const error = clientError(403, "Database error", databaseResult.error);
        return next(error);
    }
    res.json(paybackRequest.data);
});

export default outlayRouter;