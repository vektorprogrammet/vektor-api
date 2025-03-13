import { DEFAULT_QUERY_LIMIT } from "@/lib/global-variables";
import { z } from "zod";

export const sortParser = z
	.enum(["desc", "asc"])
	.optional()
	.default("desc")
	.describe("Sort descending or acending");
export const limitParser = z
	.number()
	.finite()
	.safe()
	.positive()
	.int()
	.default(DEFAULT_QUERY_LIMIT)
	.describe("Amount of items requested");
export const toLimitParser = z
	.union([z.number(), z.string()])
	.pipe(z.coerce.number())
	.pipe(limitParser)
	.default(DEFAULT_QUERY_LIMIT);
export const offsetParser = z
	.number()
	.finite()
	.safe()
	.nonnegative()
	.int()
	.default(0)
	.describe("Offset for pagination");
export const toOffsetParser = z
	.union([z.number(), z.string()])
	.pipe(z.coerce.number())
	.pipe(offsetParser)
	.default(0);
export const listQueryParser = z.object({
	sort: sortParser,
	limit: limitParser,
	offset: offsetParser,
});
export const toListQueryParser = z
	.object({
		sort: sortParser,
		limit: toLimitParser,
		offset: toOffsetParser,
	})
	.pipe(listQueryParser);

export type QueryParameters = z.infer<typeof listQueryParser>;

export const serialIdParser = z.number().finite().safe().positive().int();
export const toSerialIdParser = z
	.union([z.number(), z.string()])
	.pipe(z.coerce.number())
	.pipe(serialIdParser);
