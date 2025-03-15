import { z } from "zod";

export const timeStringParser = z.union([z.string().date(), z.string().time()]);

export const dateParser = z.date();
export const toDateParser = z
	.union([timeStringParser, z.date()])
	.pipe(z.coerce.date())
	.pipe(dateParser);

export const datePeriodParser = z
	.object({
		startDate: dateParser,
		endDate: dateParser,
	})
	.refine((datePeriod) => {
		return datePeriod.startDate.getTime() <= datePeriod.endDate.getTime();
	}, "Invalid date period. StartDate must be before or equal to endDate.");

export const toDatePeriodParser = z
	.object({
		startDate: toDateParser,
		endDate: toDateParser,
	})
	.pipe(datePeriodParser);

export const pastDateParser = z.date().max(new Date());
export const futureDateParser = z.date().min(new Date());

export type DatePeriod = z.infer<typeof datePeriodParser>;
