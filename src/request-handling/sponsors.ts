import { sponsorsTable } from "@db/tables/sponsors";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

export const sponsorRequestParser = z
	.object({
		id: serialIdParser.describe("Id of sponsor"),
		name: z.string().describe("Name of sponsor"),
		homePageURL: z.string().url().describe("URL to homepage of sponsor"),
		startDate: z
			.string()
			.date("Must be valid datestring (YYYY-MM-DD")
			.describe("Date when sponsor started support"),
		endDate: z
			.string()
			.date("Must be valid datestring (YYYY-MM-DD")
			.nullable()
			.describe("Date when sponsor ended support"),
		size: z
			.enum(["small", "medium", "large"])
			.describe("Size of sponsor support"),
		spesificDepartmentId: serialIdParser
			.nullable()
			.describe("Id of department that sponsor is connected to"),
	})
	.strict();

export const sponsorRequestToInsertParser = sponsorRequestParser
	.extend({
		name: sponsorRequestParser.shape.name.trim(),
		startDate: sponsorRequestParser.shape.startDate.pipe(
			z.coerce.date().max(new Date()),
		),
		endDate: sponsorRequestParser.shape.endDate.pipe(z.coerce.date()),
	})
	.pipe(createInsertSchema(sponsorsTable).strict().readonly());

export type NewSponsor = z.infer<typeof sponsorRequestToInsertParser>;
