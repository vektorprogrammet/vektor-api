import { teamApplicationsTable } from "@db/tables/teamApplication";
import { maxTextLength } from "@lib/globalVariables";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

export const teamApplicationParser = z.object({
	teamId: serialIdParser.describe("Id of team applied for"),
	name: z.string().min(1).describe("Name of user applying for a team"),
	email: z.string().email().describe("Email of user applying for a team"),
	motivationText: z
		.string()
		.max(maxTextLength)
		.describe("The motivation text of user applying for a team"),
	fieldOfStudyId: serialIdParser.describe(
		"Studyfield of user applying for a team",
	),
	yearOfStudy: z
		.number()
		.finite()
		.safe()
		.positive()
		.int()
		.max(7)
		.describe("The year of study the user applying for a team is in"),
	biography: z
		.string()
		.max(maxTextLength)
		.describe("The biography of the user applying for a team"),
	phonenumber: z
		.string()
		.regex(/^\d{8}$/, "Phone number must be 8 digits")
		.describe("The phonenumber of the user applying for a team"),
});

export const teamApplicationToInsertParser = teamApplicationParser
	.extend({
		email: teamApplicationParser.shape.email.trim().toLowerCase(),
		motivationText: teamApplicationParser.shape.motivationText.trim(),
		biography: teamApplicationParser.shape.biography.trim(),
	})
	.pipe(createInsertSchema(teamApplicationsTable))
	.readonly();

export type NewTeamApplication = z.infer<typeof teamApplicationToInsertParser>;
