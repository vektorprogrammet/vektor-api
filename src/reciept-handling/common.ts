import { z } from "zod";

export const queryValidator = z.object({
	sort: z
		.enum(["desc", "asc"])
		.optional()
		.default("desc")
		.describe("Sort descending or acending"),
	limit: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.int()
		.default(10)
		.describe("Amount of items requested"),
	offset: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.int()
		.default(0)
		.describe("Offset in database"),
});
