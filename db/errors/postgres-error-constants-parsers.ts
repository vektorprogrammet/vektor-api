import { zodEnumFromObjKeys } from "@/lib/lib";
import { z } from "zod";
import {
	POSTGRES_ERROR_CLASS_TO_TITLE_MAP,
	POSTGRES_ERROR_CODE_TO_MESSAGE_MAP,
	POSTGRES_ERROR_SEVERITIES,
	POSTGRES_NOTICE_SEVERITIES,
	PUBLIC_POSTGRES_ERROR_CLASSES,
} from "./postgres-error-constants";

export const postgresErrorCodeParser = zodEnumFromObjKeys(
	POSTGRES_ERROR_CODE_TO_MESSAGE_MAP,
);

export const publicPostgresErrorClassParser = zodEnumFromObjKeys(
	POSTGRES_ERROR_CLASS_TO_TITLE_MAP,
).extract(PUBLIC_POSTGRES_ERROR_CLASSES);

type PostgresErrorCode = keyof typeof POSTGRES_ERROR_CODE_TO_MESSAGE_MAP;
type PostgresErrorMessage =
	(typeof POSTGRES_ERROR_CODE_TO_MESSAGE_MAP)[PostgresErrorCode];

type PostgresErrorClass = keyof typeof POSTGRES_ERROR_CLASS_TO_TITLE_MAP;
type PostgresErrorTitle =
	(typeof POSTGRES_ERROR_CLASS_TO_TITLE_MAP)[PostgresErrorClass];

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
		message: POSTGRES_ERROR_CODE_TO_MESSAGE_MAP[code],
		class: errorClass,
		title: POSTGRES_ERROR_CLASS_TO_TITLE_MAP[errorClass],
	};
}

export const postgresSeverityParser = z
	.enum(POSTGRES_ERROR_SEVERITIES)
	.or(z.enum(POSTGRES_NOTICE_SEVERITIES));
