import type {
	HttpClientErrorMessage,
	HttpErrorMessage,
	HttpServerErrorMessage,
} from "@/src/error/error-messages";
import {
	type HttpClientErrorCode,
	type HttpClientErrorCodeInfo,
	type HttpErrorCode,
	type HttpErrorCodeInfo,
	type HttpServerErrorCode,
	type HttpServerErrorCodeInfo,
	getHttpClientErrorCodeInfo,
	getHttpErrorCodeInfo,
	getHttpServerErrorCodeInfo,
} from "@/src/error/http-codes-manipulators";
import { isORMError } from "@/src/error/orm-error";
import { fromZodError, isZodErrorLike } from "zod-validation-error";

class HttpError extends Error {
	declare message: HttpErrorMessage;
	httpCodeInfo: HttpErrorCodeInfo;
	constructor(
		message: HttpErrorMessage,
		httpCode: HttpErrorCode,
		options?: ErrorOptions,
	) {
		super(message, options);
		this.message = message;
		this.name = "HTTPError";
		this.httpCodeInfo = getHttpErrorCodeInfo(httpCode);
	}
	getResponseCode(): HttpErrorCode {
		return this.httpCodeInfo.code;
	}
	getResponseString(): string {
		let response = `${this.httpCodeInfo.title}\n${this.httpCodeInfo.code}: ${this.httpCodeInfo.message}\n${this.message}`;
		if (this.cause === undefined || !(this.cause instanceof Error)) {
			return response;
		}
		if (
			isORMError(this.cause) &&
			this.cause.getPublicDatabaseMessage() !== undefined
		) {
			response += `\n${this.cause.getPublicDatabaseMessage()}`;
		} else if (isZodErrorLike(this.cause)) {
			response += `\n${fromZodError(this.cause).message}`;
		} else if (this.cause instanceof HttpError) {
			response += `\n${this.cause.getResponseString()}`;
		} else if (this.cause instanceof Error) {
			response += `\n${this.message}`;
		}
		return response;
	}
}

class ClientError extends HttpError {
	declare message: HttpClientErrorMessage;
	declare httpCodeInfo: HttpClientErrorCodeInfo;
	constructor(
		message: HttpClientErrorMessage,
		httpCode: HttpClientErrorCode,
		options?: ErrorOptions,
	) {
		super(message, httpCode, options);
		this.message = message;
		this.name = "ClientError";
		this.httpCodeInfo = getHttpClientErrorCodeInfo(httpCode);
	}
}

class ServerError extends HttpError {
	declare message: HttpServerErrorMessage;
	declare httpCodeInfo: HttpServerErrorCodeInfo;
	constructor(
		message: HttpServerErrorMessage,
		httpCode: HttpServerErrorCode,
		options?: ErrorOptions,
	) {
		super(message, httpCode, options);
		this.message = message;
		this.name = "ServerError";
		this.httpCodeInfo = getHttpServerErrorCodeInfo(httpCode);
	}
}

export const clientError = (
	httpStatusCode: HttpClientErrorCode,
	message: HttpClientErrorMessage,
	cause?: unknown,
	options?: ErrorOptions,
): ClientError => {
	if (cause === undefined || cause === null) {
		return new ClientError(message, httpStatusCode, options);
	}
	return new ClientError(message, httpStatusCode, { ...options, cause: cause });
};

export const serverError = (
	httpStatusCode: HttpServerErrorCode,
	message: HttpServerErrorMessage,
	cause?: unknown,
	options?: ErrorOptions,
): ServerError => {
	if (cause === undefined || cause === null) {
		return new ServerError(message, httpStatusCode, options);
	}
	return new ServerError(message, httpStatusCode, { ...options, cause: cause });
};

export function isHTTPError(
	x: unknown,
): x is ServerError | ClientError | HttpError {
	return (
		x instanceof ServerError ||
		x instanceof ClientError ||
		x instanceof HttpError
	);
}
