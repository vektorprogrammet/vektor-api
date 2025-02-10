export type Result<T, E extends Error> =
	| { success: true; data: T }
	| { success: false; error: E };
