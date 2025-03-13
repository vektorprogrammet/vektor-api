import { sponsorsTable } from "@/db/tables/sponsors";
import { timeStringParser } from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sponsorRequestParser = z
	.object({
		id: serialIdParser.describe("Id of sponsor"),
		name: z.string().describe("Name of sponsor"),
		homePageUrl: z.string().url().describe("URL to homepage of sponsor"),
		startTime: timeStringParser.describe("Date when sponsor started support"),
		endTime: timeStringParser
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
		startTime: sponsorRequestParser.shape.startTime.pipe(
			z.coerce.date().max(new Date()),
		),
		endTime: sponsorRequestParser.shape.endTime.pipe(z.coerce.date()),
	})
	.pipe(createInsertSchema(sponsorsTable).strict().readonly());

export type NewSponsor = z.infer<typeof sponsorRequestToInsertParser>;
