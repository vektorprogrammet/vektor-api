import { sponsorsTable } from "@/db/tables/sponsors";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const sponsorsSelectSchema = createSelectSchema(sponsorsTable)
	.strict()
	.readonly();

export type Sponsor = z.infer<typeof sponsorsSelectSchema>;
export type SponsorKey = Sponsor["id"];
