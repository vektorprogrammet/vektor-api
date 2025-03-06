import type { NextFunction, Request, Response } from "express";

let requestCounter = 0;

export function logger(req: Request, res: Response, next: NextFunction) {
	requestCounter++;
	console.log(`Request nr. ${requestCounter} beeing processed...`);
	next();
}
