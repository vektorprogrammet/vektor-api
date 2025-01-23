import { Router, urlencoded } from "express";
import { z } from "zod";

const teamApplicationRouter = Router()

teamApplicationRouter.use(urlencoded({ extended: true }));

const teamApplicationSchema = z.object({
    id: z.coerce.number(),
	teamId: z.coerce.number(),
	name: z.string(),
	email: z.string().email(),
	motivationText: z.string(),
	fieldOfStudy: z.string(),
	yearOfStudy: z.number(),
	biography: z.string(),
	phonenumber: z.string().regex( /^\d{8}$/, "Phone number must be 8 digits"),
}).pipe