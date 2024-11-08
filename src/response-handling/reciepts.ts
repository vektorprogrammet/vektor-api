import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { recieptsTable } from "@db/tables/reciepts";

export const recieptsSelectSchema = createSelectSchema(recieptsTable).strict();

export type Reciept = z.infer<typeof recieptsSelectSchema>;
export type RecieptKey = Reciept["id"];
