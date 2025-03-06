import {
	type ParsedPostgresError,
	getDatabaseErrorPrivateMessage,
	getDatabaseErrorPublicMessage,
	postgresErrorParser,
} from "@db/errors/postgresError";
import type { Result } from "@lib/types";
import type { OrmErrorMessage } from "./errorMessages";

const defaultOrmErrorMessage: OrmErrorMessage = "Database access error";

type OrmErrorOptions = ErrorOptions & {
	customMessage?: {
		public: string;
		private: string;
	};
};

class OrmError extends Error {
	declare message: OrmErrorMessage;
	customMessage?: {
		public: string;
		private: string;
	};
	constructor(message: OrmErrorMessage, options?: OrmErrorOptions) {
		super(message, options);
		this.message = message;
		this.name = "ORMError";
		this.customMessage = options?.customMessage;
	}
	private hasDatabaseCause(): this is { cause: ParsedPostgresError } {
		return postgresErrorParser.safeParse(this.cause).success;
	}
	getPublicDatabaseMessage(): string | undefined {
		if (this.hasDatabaseCause()) {
			return getDatabaseErrorPublicMessage(this.cause);
		}
		return this.customMessage?.public;
	}
	getPrivateDatabaseMessage(): string | undefined {
		if (this.hasDatabaseCause()) {
			return getDatabaseErrorPrivateMessage(this.cause);
		}
		return this.customMessage?.private;
	}
	private hasCustomMessage(): this is { public: string; private: string } {
		return this.customMessage !== undefined;
	}
}

export function isORMError(error: unknown): error is OrmError {
	return error instanceof OrmError;
}

export function ormError(
	message: OrmErrorMessage,
	cause?: unknown,
	options?: OrmErrorOptions,
): OrmError {
	if (cause === undefined || cause === null) {
		return new OrmError(message, options);
	}
	return new OrmError(message, {
		...options,
		cause: cause,
	});
}
export function customOrmError(
	message: OrmErrorMessage,
	customPublicMessage: string,
	customPrivateMessage: string,
	options?: ErrorOptions,
): OrmError {
	return new OrmError(message, {
		...options,
		customMessage: {
			public: customPublicMessage,
			private: customPrivateMessage,
		},
	});
}

export type OrmResult<T> = Result<T, OrmError>;

export function handleDatabaseRejection(reason: unknown) {
	if (isORMError(reason)) {
		return { success: false as const, error: reason };
	}
	return {
		success: false as const,
		error: ormError(defaultOrmErrorMessage, reason),
	};
}
export function handleDatabaseFullfillment<T>(value: T): OrmResult<T> {
	return {
		success: true as const,
		data: value,
	};
}
