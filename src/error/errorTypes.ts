import { STATUS_CODES } from "http";

class AppError extends Error {
    errorCode: number
    constructor(message: string, httpErrorCode: number) {
        super(message);
        this.name = "AppError";

        if(!Object.keys(STATUS_CODES).includes(httpErrorCode.toString())) {
            throw new Error(httpErrorCode +" is not a http statuscode.");
        }
        if(Math.floor(httpErrorCode / 100) !== 4 && Math.floor(httpErrorCode / 100) !== 5) {
            throw new Error(httpErrorCode + " is not a http errorcode.");
        }
        this.errorCode = httpErrorCode;
    }
    getHTTPErrorLabel() {
        return STATUS_CODES[this.errorCode.toString()];
    }
    getResponseBody() {
        return this.message;
    }
}

export class ServerError extends AppError {
    constructor(message: string, httpErrorCode?: number) {
        if(httpErrorCode === null || httpErrorCode === undefined) {
            super(message, 500);
        } else {
            super(message, httpErrorCode);
            if(Math.floor(httpErrorCode / 100) !== 5) {
                throw new Error(httpErrorCode + " is not a valid servererrorcode. Must start with 5.")
            }
        }
        this.name = "ServerError";
    }
}

export class ClientError extends AppError {
    constructor(message: string, httpErrorCode?: number) {
        if(httpErrorCode === null || httpErrorCode === undefined) {
            super(message, 400);
        } else {
            super(message, httpErrorCode);
            if(Math.floor(httpErrorCode / 100) !== 4) {
                throw new Error(httpErrorCode + "is not a valid clienterrorcode. Must start with 4.")
            }
        }
        this.name = "ClientError";
    }
}