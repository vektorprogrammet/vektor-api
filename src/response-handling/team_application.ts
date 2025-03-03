import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { teamApplicationsTable } from "@db/tables/applications";

export const teamApplicationSelectSchema = createSelectSchema(
	teamApplicationsTable,
)
	.strict()
	.readonly();

export type TeamApplication = z.infer<typeof teamApplicationSelectSchema>;
export type TeamApplicationKey = TeamApplication["id"];
export type TeamKey = TeamApplication["teamId"];
