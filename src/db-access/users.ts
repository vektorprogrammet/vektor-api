import { database } from "@db/setup/queryPostgres";
import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@db/tables/users";
import {
	type DatabaseResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { QueryParameters } from "@src/request-handling/common";
import type {
	NewAssistantUser,
	NewTeamUser,
	NewUser,
} from "@src/request-handling/users";
import type {
	AssistantUser,
	TeamUser,
	User,
	UserKey,
} from "@src/response-handling/users";
import { eq, inArray } from "drizzle-orm";

export async function selectUsersById(
	userIds: UserKey[],
): Promise<DatabaseResult<User[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select()
				.from(usersTable)
				.where(inArray(usersTable.id, userIds));
			if (users.length !== userIds.length) {
				throw ormError("Couln't select all users, some id's didn't exist.");
			}
			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectTeamUsersById(
	userIds: UserKey[],
): Promise<DatabaseResult<TeamUser[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select({
					id: usersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					fieldOfStudyId: usersTable.fieldOfStudyId,
					bankAccountNumber: usersTable.bankAccountNumber,
					phoneNumber: usersTable.phoneNumber,
					personalEmail: usersTable.personalEmail,
					teamId: teamUsersTable.teamId,
					username: teamUsersTable.username,
				})
				.from(teamUsersTable)
				.where(inArray(assistantUsersTable.id, userIds))
				.innerJoin(usersTable, eq(teamUsersTable.id, usersTable.id));
			if (users.length !== userIds.length) {
				throw ormError("Couln't select all users, some id's didn't exist.");
			}
			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectAssistantUsersById(
	userIds: UserKey[],
): Promise<DatabaseResult<AssistantUser[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select({
					id: usersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					fieldOfStudyId: usersTable.fieldOfStudyId,
					phoneNumber: usersTable.phoneNumber,
					personalEmail: usersTable.personalEmail,
					bankAccountNumber: usersTable.bankAccountNumber,
				})
				.from(assistantUsersTable)
				.where(inArray(assistantUsersTable.id, userIds))
				.innerJoin(usersTable, eq(assistantUsersTable.id, usersTable.id));
			if (users.length !== userIds.length) {
				throw ormError("Couln't select all users, some id's didn't exist.");
			}
			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectUsers(
	queryParameters: QueryParameters,
): Promise<DatabaseResult<User[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select()
				.from(usersTable)
				.limit(queryParameters.limit)
				.offset(queryParameters.offset);

			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectTeamUsers(
	queryParameters: QueryParameters,
): Promise<DatabaseResult<TeamUser[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select({
					id: usersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					fieldOfStudyId: usersTable.fieldOfStudyId,
					bankAccountNumber: usersTable.bankAccountNumber,
					phoneNumber: usersTable.phoneNumber,
					personalEmail: usersTable.personalEmail,
					teamId: teamUsersTable.teamId,
					username: teamUsersTable.username,
				})
				.from(teamUsersTable)
				.innerJoin(usersTable, eq(teamUsersTable.id, usersTable.id))
				.limit(queryParameters.limit)
				.offset(queryParameters.offset);

			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function selectAssistantUsers(
	queryParameters: QueryParameters,
): Promise<DatabaseResult<AssistantUser[]>> {
	return database
		.transaction(async (tx) => {
			const users = await tx
				.select({
					id: usersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					fieldOfStudyId: usersTable.fieldOfStudyId,
					bankAccountNumber: usersTable.bankAccountNumber,
					phoneNumber: usersTable.phoneNumber,
					personalEmail: usersTable.personalEmail,
				})
				.from(assistantUsersTable)
				.innerJoin(usersTable, eq(assistantUsersTable.id, usersTable.id))
				.limit(queryParameters.limit)
				.offset(queryParameters.offset);

			return users;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function insertUsers(
	user: NewUser[],
): Promise<DatabaseResult<User[]>> {
	return database
		.transaction(async (tx) => {
			return await tx.insert(usersTable).values(user).returning();
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function insertTeamUsers(
	teamUser: NewTeamUser[],
): Promise<DatabaseResult<TeamUser[]>> {
	return database
		.transaction(async (tx) => {
			const newTeamUserTables = await tx
				.insert(teamUsersTable)
				.values(teamUser)
				.returning();
			const newTeamUserIds = newTeamUserTables.map((user) => user.id);
			const newTeamUsersResult = await selectTeamUsersById(newTeamUserIds);
			if (!newTeamUsersResult.success) {
				throw ormError(
					"Error when inserting team users",
					newTeamUsersResult.error,
				);
			}
			return newTeamUsersResult.data;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}

export async function insertAssistantUsers(
	assistantUser: NewAssistantUser[],
): Promise<DatabaseResult<NewAssistantUser[]>> {
	return database
		.transaction(async (tx) => {
			const newAssistantUserTables = await tx
				.insert(assistantUsersTable)
				.values(assistantUser)
				.returning();
			const newAssistantUserIds = newAssistantUserTables.map((user) => user.id);
			const newAssistantUsersResult =
				await selectAssistantUsersById(newAssistantUserIds);
			if (!newAssistantUsersResult.success) {
				throw ormError(
					"Error when inserting assistant users",
					newAssistantUsersResult.error,
				);
			}
			return newAssistantUsersResult.data;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
