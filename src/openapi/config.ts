import "zod-openapi/extend";
import { hostOptions } from "@src/enviroment";
import {
	datePeriodParser,
	limitParser,
	offsetParser,
	serialIdParser,
	sortParser,
} from "@src/request-handling/common";
import { expenseRequestParser } from "@src/request-handling/expenses";
import { expensesSelectSchema } from "@src/response-handling/expenses";
import openapiFromJsdoc from "swagger-jsdoc";
import { createDocument } from "zod-openapi";

const openapiDocument = createDocument({
	openapi: "3.1.0",
	info: {
		title: "Vektor API",
		version: "0.0.1",
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
			name: "expenses",
			description: "",
		},
	],
	paths: {},
	components: {
		schemas: {
			expenseRequest: expenseRequestParser,
			expense: expensesSelectSchema,
			period: datePeriodParser,
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
