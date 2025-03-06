import {
	type ParsedPostgresError,
	getDatabaseErrorPrivateMessage,
	getDatabaseErrorPublicMessage,
	postgresErrorParser,
} from "@db/errors/postgresError";
import type { Result } from "@lib/types";

const defaultORMErrorMessage = "Database access error" as const;

class ORMError extends Error {
	customMessage?: {
		public: string;
		private: string;
	};
	constructor(
		message: string,
		options?: ErrorOptions & {
			customMessage?: {
				public: string;
				private: string;
			};
		},
	) {
		super(message, options);
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
	private hasCustomMessage(): this is {
		customMessage: { public: string; private: string };
	} {
		return this.customMessage !== undefined;
	}
}

export function isORMError(error: unknown): error is ORMError {
	return error instanceof ORMError;
}

export function ormError(message: string, cause?: unknown): ORMError {
	return new ORMError(message, { cause: cause });
}
export function customOrmError(
	message: string,
	customPublicMessage: string,
	customPrivateMessage: string,
): ORMError {
	return new ORMError(message, {
		customMessage: {
			public: customPublicMessage,
			private: customPrivateMessage,
		},
	});
}

export type ORMResult<T> = Result<T, ORMError>;

export function handleDatabaseRejection(reason: unknown) {
	if (isORMError(reason)) {
		return { success: false as const, error: reason };
	}
	return {
		success: false as const,
		error: ormError(defaultORMErrorMessage, reason),
	};
}
export function handleDatabaseFullfillment<T>(value: T): ORMResult<T> {
	return {
		success: true as const,
		data: value,
	};
}
