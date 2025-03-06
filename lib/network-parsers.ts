import { z } from "zod";

export const portParser = z
	.number({
		invalid_type_error: "not a valid port. must be a number",
	})
	.nonnegative("ports cannot be negative numbers")
	.max(65535, "ports cannot be higher than 65535(2^16 - 1)")
	.finite()
	.safe()
	.int("ports must have integer values");

export const toPortParser = z
	.union([z.number(), z.string()])
	.pipe(z.coerce.number())
	.pipe(portParser);

export const hostingStringParser = z.union(
	[z.literal("localhost"), z.string().url(), z.string().ip()],
	{
		invalid_type_error:
			"not a valid host string, must be localhost, a url or an IP-adress",
	},
);
