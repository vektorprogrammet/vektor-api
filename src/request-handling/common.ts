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
	.default(10)
	.describe("Amount of items requested");
export const toLimitParser = z
	.union([z.number(), z.string()])
	.pipe(z.coerce.number())
	.pipe(limitParser);
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
	.pipe(offsetParser);
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

export const dateParser = z.date();
export const toDateParser = z
	.union([z.string().date(), z.date()])
	.pipe(z.coerce.date())
	.pipe(dateParser);

export const datePeriodParser = z.object({
	startDate: dateParser,
	endDate: dateParser,
}).refine((datePeriod) => {
	return datePeriod.startDate.getTime() <= datePeriod.endDate.getTime();
}, "Invalid date period. StartDate must be before or equal to endDate.");

export const toDatePeriodParser = z.object({
	startDate: toDateParser,
	endDate: toDateParser,
}).pipe(datePeriodParser);

export type datePeriod = z.infer<typeof datePeriodParser>;
