import { clientError } from "@src/error/errorTypes";
import { parseMoneyToTwoDecimals, removeSeparatorsNorwegianAccountNumberNoIBAN} from "@src/parsing/moneyParser"
import { Router, urlencoded } from "express"
import { z } from "zod";
import { recieptInsertSchema } from "@db/schema/reciepts";
import { insertReciepts } from "@db/access/reciepts"

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
}).pipe(recieptInsertSchema.strict());

outlayRouter.use(urlencoded({ extended: true }));

outlayRouter.post("/new", (req, res, next) => {
    let outlayRequest = outlayRequestSchema.safeParse(req.body);
    if(!outlayRequest.success) {
        const error = clientError(400, "Failed parsing outlayrequest.", outlayRequest.error);
        return next(error);
    }
    insertReciepts([outlayRequest.data]);
    console.log(outlayRequest.data);
    res.json(outlayRequest.data);
});

export default outlayRouter;