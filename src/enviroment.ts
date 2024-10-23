import * as process from "node:process";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const enviromentVariables = process.env;

const hostOptionsSchema = z
	.object({
		PORT: z.coerce.number(),
		PUBLIC_URL: z.optional(z.string().url()),
		PRIVATE_URL: z.union([z.literal("localhost"), z.string().url()]),
	})
	.transform((schema) => {
		return {
			port: schema.PORT,
			publicURL: schema.PUBLIC_URL,
			privateURL: schema.PRIVATE_URL,
		};
	});

const parsedEnviromentVariablesResult =
	hostOptionsSchema.safeParse(enviromentVariables);
if (!parsedEnviromentVariablesResult.success) {
	throw new Error(
		`Invalid enviroment varaibles: ${fromZodError(parsedEnviromentVariablesResult.error).message}`,
	);
}
export const hostOptions = parsedEnviromentVariablesResult.data;
