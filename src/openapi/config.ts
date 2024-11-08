import "zod-openapi/extend";
import { recieptsSelectSchema } from "@src/response-handling/reciepts";
import { hostOptions } from "@src/enviroment";
import { queryValidator } from "@src/request-handling/common";
import { outlayRequestValidator } from "@src/request-handling/outlayHandling";
import { recieptIdValidator } from "@src/request-handling/recieptHandling";
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
	paths: {},
	components: {
		schemas: {
			OutlayRequest: outlayRequestValidator,
			RecieptId: recieptIdValidator,
			Reciept: recieptsSelectSchema,
			Query: queryValidator,
		},
	},
});

export const openapiSpecification = openapiFromJsdoc({
	definition: openapiDocument,
	apis: ["src/main.ts", "src/routers/*.ts", "src/routers/*/*.ts"],
});
