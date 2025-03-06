import { HTTP_STATUS_CODE_MAP } from "@/src/error/http-codes";

export type HttpClientErrorCode =
	keyof (typeof HTTP_STATUS_CODE_MAP)["Client error"];
export type HttpServerErrorCode =
	keyof (typeof HTTP_STATUS_CODE_MAP)["Server error"];
export type HttpErrorCode = HttpClientErrorCode | HttpServerErrorCode;

function isHttpClientErrorCode(code: number): code is HttpClientErrorCode {
	return Object.keys(HTTP_STATUS_CODE_MAP["Client error"])
		.map(Number)
		.includes(code);
}

export type HttpClientErrorCodeInfo = {
	title: "Client error";
	code: HttpClientErrorCode;
	message: (typeof HTTP_STATUS_CODE_MAP)["Client error"][HttpClientErrorCode];
};
export type HttpServerErrorCodeInfo = {
	title: "Server error";
	code: HttpServerErrorCode;
	message: (typeof HTTP_STATUS_CODE_MAP)["Server error"][HttpServerErrorCode];
};
export type HttpErrorCodeInfo =
	| HttpClientErrorCodeInfo
	| HttpServerErrorCodeInfo;

export function getHttpClientErrorCodeInfo(
	code: HttpClientErrorCode,
): HttpClientErrorCodeInfo {
	return {
		title: "Client error",
		code: code,
		message: HTTP_STATUS_CODE_MAP["Client error"][code],
	};
}
export function getHttpServerErrorCodeInfo(
	code: HttpServerErrorCode,
): HttpServerErrorCodeInfo {
	return {
		title: "Server error",
		code: code,
		message: HTTP_STATUS_CODE_MAP["Server error"][code],
	};
}
export function getHttpErrorCodeInfo(code: HttpErrorCode): HttpErrorCodeInfo {
	if (isHttpClientErrorCode(code)) {
		return getHttpClientErrorCodeInfo(code);
	}
	return getHttpServerErrorCodeInfo(code);
}
