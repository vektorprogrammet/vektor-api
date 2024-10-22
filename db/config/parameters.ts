import "dotenv";
import * as process from "node:process";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const enviromentVariables = process.env;

const databaseConnectionParametersSchema = z
	.object({
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_PORT: z.coerce.number().positive().finite().safe().int(),
		SSL_OPTION: z.union([
			z.literal("true").transform(() => {
				return true;
			}),
			z.literal("false").transform(() => {
				return false;
			}),
			z.literal("require"),
			z.literal("allow"),
			z.literal("prefer"),
			z.literal("verify-full"),
		]),
	})
	.transform((schema) => {
		return {
			host: schema.DATABASE_HOST.trim(),
			database: schema.DATABASE_NAME.trim(),
			user: schema.DATABASE_USER.trim(),
			password: schema.DATABASE_PASSWORD.trim(),
			port: schema.DATABASE_PORT,
			ssl: schema.SSL_OPTION,
		};
	});

const parsedEnviromentVariablesResult =
	databaseConnectionParametersSchema.safeParse(enviromentVariables);
if (!parsedEnviromentVariablesResult.success) {
	throw new Error(
		`Invalid enviroment varaibles: ${fromZodError(parsedEnviromentVariablesResult.error).message}`,
	);
}
const parsedEnviromentVariables = parsedEnviromentVariablesResult.data;

type DatabaseConnectionOptions = z.infer<
	typeof databaseConnectionParametersSchema
>;

export const databaseConnectionParameters: DatabaseConnectionOptions =
	parsedEnviromentVariables;

export const drizzleDatabaseCredentials = databaseConnectionParameters;
