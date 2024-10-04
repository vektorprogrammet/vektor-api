import { STATUS_CODES } from "http";
import { ZodError, ZodErrorMap, ZodIssueCode } from "zod";

class AppError extends Error {
    errorCode: number
    displayCause: boolean
    constructor(message: string, httpErrorCode: number, displayCause: boolean) {
        super(message);
        if(!Object.keys(STATUS_CODES).includes(httpErrorCode.toString())) {
            throw new Error(httpErrorCode +" is not a http statuscode.");
        }
        if(Math.floor(httpErrorCode / 100) !== 4 && Math.floor(httpErrorCode / 100) !== 5) {
            throw new Error(httpErrorCode + " is not a http errorcode.");
        }
        this.name = "AppError";
        this.errorCode = httpErrorCode;
        this.displayCause = displayCause;
    }
    getHTTPErrorLabel() {
        return STATUS_CODES[this.errorCode.toString()];
    }
    getResponseBody() {
        let causeString = "";
        if (this.displayCause) {
            let cause = this.cause as Error;
            while(cause) {
                if (isCustomError(cause)) {
                    if (cause.displayCause) {
                        causeString += cause.getResponseBody();
                    } else {
                        causeString += cause.message;
                        break;
                    }
                } else {
                    causeString += cause.message;
                    break;
                }
                cause = cause.cause as Error;
            }
        }
        return this.errorCode.toString() + " " + this.getHTTPErrorLabel() + ": " + this.message + "\n" + causeString;
    }
}

class ServerError extends AppError {
    constructor(message: string, httpErrorCode: number = 500, displayCause: boolean = false) {
        super(message, httpErrorCode, displayCause);
        if(Math.floor(httpErrorCode / 100) !== 5) {
            throw new Error(httpErrorCode + " is not a valid servererrorcode. Must start with 5.")
        }
        this.name = "ServerError";
    }
}

class ClientError extends AppError {
    constructor(message: string, httpErrorCode: number = 400, displayCause: boolean = true) {
        super(message, httpErrorCode, displayCause);
        if(Math.floor(httpErrorCode / 100) !== 4) {
            throw new Error(httpErrorCode + "is not a valid clienterrorcode. Must start with 4.")
        }
        this.name = "ClientError";
    }
}

export const clientError = (httpStatusCode: number = 400, message: string, cause?: Error, displayCause: boolean = true): ClientError => {
    let error =  new ClientError(message, httpStatusCode, displayCause);
    if (cause !== undefined) {
        error.cause = cause;
    }
    return error;
}

export const serverError = (httpStatusCode: number = 500, message: string, cause?: Error, displayCause: boolean = false): ServerError => {
    let error = new ServerError(message, httpStatusCode, displayCause);
    if (cause !== undefined) {
        error.cause = cause;
    }
    return error;
}

export const isCustomError = (x: any) => {
    return (x instanceof ServerError || x instanceof ClientError);
}
export const isZodError = (x: any) => {
    return (x instanceof ZodError)
}