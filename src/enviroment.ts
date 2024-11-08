import "dotenv/config";
import { env } from "node:process";
import { z } from "zod";

export const hostOptions = z
	.object({
		PORT: z.coerce.number(),
		HOSTING_URL: z.union([
			z.literal("localhost"),
			z.string().url(),
			z.string().ip(),
		]),
	})
	.transform((schema) => {
		return {
			port: schema.PORT,
			hosting_url: schema.HOSTING_URL,
		};
	})
	.parse(env);
