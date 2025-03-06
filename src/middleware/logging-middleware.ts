import type { NextFunction, Request, Response } from "express";

let requestCounter = 0;

export function logger(_req: Request, _res: Response, next: NextFunction) {
	requestCounter++;
	console.info(`Request nr. ${requestCounter} beeing processed...`);
	next();
}
