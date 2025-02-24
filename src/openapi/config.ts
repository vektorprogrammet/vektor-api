import "zod-openapi/extend";
import { teamUsersTable } from "@db/tables/users";
import { hostOptions } from "@src/enviroment";
import {
	datePeriodParser,
	limitParser,
	offsetParser,
	serialIdParser,
	sortParser,
} from "@src/request-handling/common";
import { expenseRequestParser } from "@src/request-handling/expenses";
import {
	assistantUserRequestParser,
	teamUserRequestParser,
	userRequestParser,
} from "@src/request-handling/users";
import { expensesSelectSchema } from "@src/response-handling/expenses";
import {
	assistantUserSelectSchema,
	teamUserSelectSchema,
	userSelectSchema,
} from "@src/response-handling/users";
import openapiFromJsdoc from "swagger-jsdoc";
import { createDocument } from "zod-openapi";

const openapiDocument = createDocument({
	openapi: "3.1.0",
	info: {
		title: "Vektor API",
		version: "0.0.1",
		description: "No trailing slashes\nPlural path names\nPaths are described by nouns, not verbs\nHTTP Method works as described:\n- GET: Used to retrieve a representation of a resource, should return the resource\n- POST: Used to create new new resources and sub-resources, should provide the path to the resource in the location header of the response, and should return the added resource\n- PUT: Used to update existing resources, should return the modified resource- DELETE: Used to delete existing resources, should return the deleted resource"
	},
	servers: [
		{
			url: `{protocol}${hostOptions.hosting_url}{port}`,
			description: "Your local API",
			variables: {
				port: {
					default: `:${hostOptions.port}`,
					enum: ["", `:${hostOptions.port}`],
					description: "Optional hosting port",
				},
				protocol: {
					default: "",
					enum: ["", "http://", "https://"],
					description: "Optional hosting protocol",
				},
			},
		},
		{
			url: "https://vektor-api-se528.ondigitalocean.app/",
			description: "Development vektor api on digital ocean",
		},
	],
	tags: [
		{
			name: "expenses",
			description: "",
		},
		{
			name: "users",
			description: "",
		},
	],
	paths: {},
	components: {
		schemas: {
			expenseRequest: expenseRequestParser,
			expense: expensesSelectSchema,
			user: userSelectSchema,
			teamUser: teamUserSelectSchema,
			assistantUser: assistantUserSelectSchema,
			userRequest: userRequestParser,
			teamUserRequest: teamUserRequestParser,
			assistantUserRequest: assistantUserRequestParser,
			datePeriod: datePeriodParser,
		},
		parameters: {
			id: serialIdParser.openapi({ param: { in: "path", name: "id" } }),
			limit: limitParser.openapi({ param: { in: "query", name: "limit" } }),
			sort: sortParser.openapi({ param: { in: "query", name: "sort" } }),
			offset: offsetParser.openapi({
				param: { in: "query", name: "offset" },
			}),
		},
	},
});

export const openapiSpecification = openapiFromJsdoc({
	definition: openapiDocument,
	apis: ["src/main.ts", "src/routers/*.ts", "src/routers/*/*.ts"],
});
