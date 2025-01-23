import { ZodError } from "zod";

export type Result<T, E extends Error> =
	| { success: true; data: T }
	| { success: false; error: E };

export const isZodError = (x: unknown): x is ZodError => {
	return x instanceof ZodError;
};

class ParseError<T> extends Error {
	private parseObject: T;
	constructor(message: string, parseObject: T) {
		super(message);
		this.parseObject = parseObject;
	}
	public getParseObject(): T {
		return this.parseObject;
	}
	public into<U>(newObject: U, newMessage?: string): ParseError<U> {
		const newError = parseError(newMessage === undefined ? this.message : newMessage, newObject);
		newError.cause = this;
		Error.captureStackTrace(newError);
		return newError;
	}
}

export type ParseResult<T> = Result<T, ParseError<T>>;

export function parseError<T>(message: string, parseObject: T) {
	const error = new ParseError(message, parseObject);
	Error.captureStackTrace(error);
	return error;
}