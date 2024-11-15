import { z } from "zod";

export const sortValidator = z
	.enum(["desc", "asc"])
	.optional()
	.default("desc")
	.describe("Sort descending or acending");
export const limitValidator = z.coerce
	.number()
	.finite()
	.safe()
	.positive()
	.int()
	.default(10)
	.describe("Amount of items requested");
export const offsetValidator = z.coerce
	.number()
	.finite()
	.safe()
	.nonnegative()
	.int()
	.default(0)
	.describe("Offset for pagination");

export const queryValidator = z.object({
	sort: sortValidator,
	limit: limitValidator,
	offset: offsetValidator,
});

export type QueryParameters = z.infer<typeof queryValidator>;

export const idValidator = z.coerce
	.number()
	.finite()
	.safe()
	.positive()
	.int()
	.describe("Identity of element");
