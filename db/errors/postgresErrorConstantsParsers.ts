import { zodEnumFromObjKeys } from "@lib/lib";
import { z } from "zod";
import {
	postgresErrorClassToTitleMap,
	postgresErrorCodeToMessageMap,
	postgresErrorSeverities,
	postgresNoticeSeverities,
	publicPostgresErrorClasses,
} from "./postgresErrorConstants";

export const postgresErrorCodeParser = zodEnumFromObjKeys(
	postgresErrorCodeToMessageMap,
);

export const publicPostgresErrorClassParser = zodEnumFromObjKeys(
	postgresErrorClassToTitleMap,
).extract(publicPostgresErrorClasses);

type PostgresErrorCode = keyof typeof postgresErrorCodeToMessageMap;
type PostgresErrorMessage =
	(typeof postgresErrorCodeToMessageMap)[PostgresErrorCode];

type PostgresErrorClass = keyof typeof postgresErrorClassToTitleMap;
type PostgresErrorTitle =
	(typeof postgresErrorClassToTitleMap)[PostgresErrorClass];

export function generatePostgresErrorCodeInfo(code: PostgresErrorCode): {
	code: PostgresErrorCode;
	message: PostgresErrorMessage;
	class: PostgresErrorClass;
	title: PostgresErrorTitle;
} {
	// Assertion because the first two letters of a error code is defined as the class name
	const errorClass = code.substring(0, 2) as PostgresErrorClass;
	return {
		code,
		message: postgresErrorCodeToMessageMap[code],
		class: errorClass,
		title: postgresErrorClassToTitleMap[errorClass],
	};
}

export const postgresSeverityParser = z
	.enum(postgresErrorSeverities)
	.or(z.enum(postgresNoticeSeverities));
