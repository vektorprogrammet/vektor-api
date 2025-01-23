import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { teamApplicationsTable } from "@db/tables/teamApplication";

export const expensesSelectSchema = createSelectSchema(teamApplicationsTable).strict();

export type TeamApplication = z.infer<typeof expensesSelectSchema>;
export type TeamApplicationKey = TeamApplication["id"];