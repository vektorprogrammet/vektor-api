import { HTTP_STATUS_CODE_MAP } from "@/src/error/http-codes";

export type HttpClientErrorCode =
	keyof (typeof HTTP_STATUS_CODE_MAP)["client error"];
export type HttpServerErrorCode =
	keyof (typeof HTTP_STATUS_CODE_MAP)["server error"];
export type HttpErrorCode = HttpClientErrorCode | HttpServerErrorCode;

function isHttpClientErrorCode(code: number): code is HttpClientErrorCode {
	return Object.keys(HTTP_STATUS_CODE_MAP["client error"])
		.map(Number)
		.includes(code);
}

export type HttpClientErrorCodeInfo = {
	title: "client error";
	code: HttpClientErrorCode;
	message: (typeof HTTP_STATUS_CODE_MAP)["client error"][HttpClientErrorCode];
};
export type HttpServerErrorCodeInfo = {
	title: "server error";
	code: HttpServerErrorCode;
	message: (typeof HTTP_STATUS_CODE_MAP)["server error"][HttpServerErrorCode];
};
export type HttpErrorCodeInfo =
	| HttpClientErrorCodeInfo
	| HttpServerErrorCodeInfo;

export function getHttpClientErrorCodeInfo(
	code: HttpClientErrorCode,
): HttpClientErrorCodeInfo {
	return {
		title: "client error",
		code: code,
		message: HTTP_STATUS_CODE_MAP["client error"][code],
	};
}
export function getHttpServerErrorCodeInfo(
	code: HttpServerErrorCode,
): HttpServerErrorCodeInfo {
	return {
		title: "server error",
		code: code,
		message: HTTP_STATUS_CODE_MAP["server error"][code],
	};
}
export function getHttpErrorCodeInfo(code: HttpErrorCode): HttpErrorCodeInfo {
	if (isHttpClientErrorCode(code)) {
		return getHttpClientErrorCodeInfo(code);
	}
	return getHttpServerErrorCodeInfo(code);
}
