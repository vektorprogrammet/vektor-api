import { departmentsTable } from "@db/tables/departments";
import { expensesTable } from "@db/tables/expenses";
import { fieldsOfStudyTable } from "@db/tables/fieldsOfStudy";
import { teamsTable } from "@db/tables/team";
import { teamApplicationsTable } from "@db/tables/teamApplication";
import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@db/tables/users";

export const seedingTables = {
	departmentsTable,
	fieldsOfStudyTable,
	teamsTable,
	usersTable,
	teamUsersTable,
	assistantUsersTable,
	teamApplicationsTable,
	expensesTable,
};
