import { z } from "zod";
import {
	generatePostgresErrorCodeInfo,
	postgresErrorCodeParser,
	postgresSeverityParser,
	publicPostgresErrorClassParser,
} from "./postgresErrorConstantsParsers";

// Inspiration from
// https://www.postgresql.org/docs/9.3/protocol-error-fields.html and
// https://github.com/brianc/node-postgres/blob/master/packages/pg-protocol/src/messages.ts

export const postgresErrorParser = z
	.object({
		length: z.number().finite().safe().int().nonnegative(),
		name: z.string(),
		code: postgresErrorCodeParser,
		severity: postgresSeverityParser,
		detail: z.string().optional(),
		hint: z.string().optional(),
		position: z
			.string()
			.pipe(z.coerce.number().finite().safe().int().nonnegative())
			.optional(),
		internalPosition: z
			.string()
			.pipe(z.coerce.number().finite().safe().int().nonnegative())
			.optional(),
		internalQuery: z.string().optional(),
		where: z.string().optional(),
		schema: z.string().optional(),
		table: z.string().optional(),
		column: z.string().optional(),
		dataType: z.string().optional(),
		constaint: z.string().optional(),
		file: z.string().optional(),
		line: z
			.string()
			.pipe(z.coerce.number().finite().safe().int().nonnegative())
			.optional(),
		routine: z.string().optional(),
	})
	.readonly()
	.refine((error) => {
		return (
			(error.internalPosition === undefined ||
				error.internalQuery !== undefined) && // internalPosition -> internalQuery
			(error.dataType === undefined || error.column !== undefined) && // dataType -> column
			(error.column === undefined || error.table !== undefined) && // column -> table
			(error.table === undefined || error.schema !== undefined) // table -> schema
		);
	});

export type ParsedPostgresError = z.infer<typeof postgresErrorParser>;

export function getDatabaseErrorPublicMessage(
	databaseError: ParsedPostgresError,
): string {
	const codeInfo = generatePostgresErrorCodeInfo(databaseError.code);
	let errorString = `severity: ${databaseError.severity}`;
	if (publicPostgresErrorClassParser.safeParse(codeInfo.class).success) {
		errorString = `(${databaseError.severity}) ${codeInfo.title}: ${codeInfo.message}`;
	}
	return errorString;
}
export function getDatabaseErrorPrivateMessage(
	databaseError: ParsedPostgresError,
): string {
	const codeInfo = generatePostgresErrorCodeInfo(databaseError.code);
	let errorString = `severity: ${databaseError.severity}\n`;
	errorString += `class: ${codeInfo.title}(${codeInfo.class})\n`;
	errorString += `code: ${codeInfo.message}(${codeInfo.code})\n`;
	if (databaseError.detail !== undefined) {
		errorString += `detail: ${databaseError.detail}\n`;
	}
	if (databaseError.hint !== undefined) {
		errorString += `hint: ${databaseError.hint}\n`;
	}
	if (databaseError.schema !== undefined) {
		errorString += `schema: ${databaseError.schema}\n`;
	}
	if (databaseError.table !== undefined) {
		errorString += `table: ${databaseError.table}\n`;
	}
	if (databaseError.column !== undefined) {
		errorString += `column: ${databaseError.column}\n`;
	}
	if (databaseError.dataType !== undefined) {
		errorString += `data type: ${databaseError.dataType}`;
	}
	return errorString;
}
