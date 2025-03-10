import { teamsTable } from "@db/tables/team";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const teamsSelectSchema = createSelectSchema(teamsTable)
	.strict()
	.readonly();

export type Team = z.infer<typeof teamsSelectSchema>;
export type TeamKey = Team["id"];
