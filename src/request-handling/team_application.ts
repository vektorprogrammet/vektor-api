import { maxTextLength } from "@lib/globalVariables";
import { z } from "zod";

export const teamApplicationValidator = z.object({
	id: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.describe("Id of team application requested"),
	teamId: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.describe("Id of team applied for"),
	name: z.string().min(1).describe("Name of user applying for a team"),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email()
		.describe("Email of user applying for a team"),
	motivationText: z
		.string()
		.trim()
		.max(maxTextLength)
		.describe("The motivation text of user applying for a team"),
	fieldOfStudy: z
		.string()
		.trim()
		.max(maxTextLength)
		.describe("Studyfield of user applying for a team"),
	yearOfStudy: z
		.number()
		.finite()
		.safe()
		.positive()
		.describe("The year of study the user applying for a team is in"),
	biography: z
		.string()
		.trim()
		.max(maxTextLength)
		.describe("The biography of the user applying for a team"),
	phonenumber: z
		.string()
		.regex(/^\d{8}$/, "Phone number must be 8 digits")
		.describe("The phonenumber of the user applying for a team"),
});
