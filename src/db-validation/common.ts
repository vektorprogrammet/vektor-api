import { z } from "zod";

export const keySchema = z.number().finite().safe().positive().int();
