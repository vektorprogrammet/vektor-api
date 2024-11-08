declare namespace Express {
	interface Request {
		idQuery: number;
		userQuery: import("@db/schema/users").NewUser;
	}
	interface Response {
		hasInsertedUser: boolean;
		users: import("@db/schema/users").User[];
	}
}
