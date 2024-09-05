import { RequestHandler } from "express";
import { ClientError, ServerError } from "@src/error/errorTypes";
import { getUsersFromId, insertUsers } from "@db/access/users";

export const getUser: RequestHandler = async (req, res, next) => {
    let id = req.idQuery;
    if(id === undefined) {
        return next(new ServerError("Failed parsing id query."));
    }
    res.users = await getUsersFromId(id);
    if(res.users.length === 0) {
        return next(new ClientError("Couln't find any user with id " + id, 404));
    }
    next();
}

export const insertUserHandler: RequestHandler = async (req, res, next) => {
    let user = req.userQuery;
	if(user === undefined) {
		return next(new ServerError("Failed to parse user query."));
	}
	await insertUsers([user]);
    res.hasInsertedUser = true;
	next();
}