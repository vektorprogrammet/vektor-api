import { env } from "node:process";
import type { ConnectionOptions } from "node:tls";
import { z } from "zod";

function getCaCert(): string | Buffer | Array<string | Buffer> | undefined {
	return env.CA_CERT;
}

export const databaseConnectionParameters = z
	.object({
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_PORT: z.coerce.number().positive().finite().safe().int(),
		DATABASE_SSL_OPTION: z
			.union([
				z.literal("prod").transform((_, ctx) => {
					return {
						requestCert: true,
						rejectUnauthorized: true,
					} as ConnectionOptions;
				}),
				z.literal("prod-provide_ca_cert").transform((_, ctx) => {
					const ca_cert = getCaCert();
					if (ca_cert === undefined) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Could not find ca certificate",
						});
						return z.NEVER;
					}
					return {
						requestCert: true,
						rejectUnauthorized: true,
						ca: ca_cert,
					} as ConnectionOptions;
				}),
				z.literal("dev").transform(() => {
					return {
						requestCert: true,
						rejectUnauthorized: false,
					} as ConnectionOptions;
				}),
				z.literal("true").transform(() => {
					return true;
				}),
				z.literal("false").transform(() => {
					return false;
				}),
			])
			.default("prod"),
	})
	.transform((schema) => {
		return {
			host: schema.DATABASE_HOST.trim(),
			database: schema.DATABASE_NAME.trim(),
			user: schema.DATABASE_USER.trim(),
			password: schema.DATABASE_PASSWORD.trim(),
			port: schema.DATABASE_PORT,
			ssl: schema.DATABASE_SSL_OPTION,
		};
	})
	.parse(env);

if (env.LOG_DATABASE_CREDENTIALS_ON_STARTUP === "true") {
	console.log("Database parameters:", databaseConnectionParameters);
}
