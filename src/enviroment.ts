import { hostingStringParser, toPortParser } from "@/lib/network-parsers";
import "dotenv/config";
import { env } from "node:process";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const hostOptionsResult = z
	.object({
		PORT: toPortParser,
		HOSTING_URL: hostingStringParser,
	})
	.transform((schema) => {
		return {
			port: schema.PORT,
			hosting_url: schema.HOSTING_URL,
		};
	})
	.safeParse(env);

if (!hostOptionsResult.success) {
	console.error("Error when parsing enviroment variables.");
	console.error(fromZodError(hostOptionsResult.error).message);
	process.exit(1);
}

export const hostOptions = hostOptionsResult.data;
