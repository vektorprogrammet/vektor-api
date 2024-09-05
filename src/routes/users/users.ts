import { Router } from "express"

import { ServerError } from "@src/error/errorTypes";
import { insertUsers } from "@db/access/users";

import { idParser } from        "@routes/users/databaseIdParser";
import { newUserParser } from   "@routes/users/databaseNewUserParser";
import { getUser } from         "@routes/users/usersMiddleware";
import { Server } from "mysql2/typings/mysql/lib/Server";

const usersRouter = Router();

usersRouter.use("/get", idParser);
usersRouter.use("/get", getUser);

usersRouter.use("/post", newUserParser);

usersRouter.get("/get", (req, res, next) => {
	let users = res.users;
	if (users === undefined) {
		return next(new ServerError("Failed to get users from database."));
	}
	res.json(users);
});

usersRouter.post("/post", async (req, res, next) => {
    let hasInsertedUser = res.hasInsertedUser;
    if(hasInsertedUser !== true) {
        return next(new ServerError("Failed to insert user into database"));
    }
    res.send("Done!");
});

export default usersRouter;