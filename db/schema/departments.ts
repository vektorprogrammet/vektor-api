import { serial } from 'drizzle-orm/pg-core';
import schema from '@db/schema/schema';

export const cities = schema.enum("city", ["Trondheim", "Ås", "Bergen"]);

export const departmentsSchema = schema.table("departments", {
    id: serial('id').primaryKey(),
    city: cities("city").notNull(),
});
export type Department = typeof departmentsSchema.$inferSelect;
export type NewDepartment = typeof departmentsSchema.$inferInsert;
