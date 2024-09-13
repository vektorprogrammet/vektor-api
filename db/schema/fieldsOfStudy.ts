import { serial, text, integer } from 'drizzle-orm/pg-core';
import schema from '@db/schema/schema';

export const fieldsOfStudySchema = schema.table("fieldsOfStudy", {
    id: serial('id').primaryKey(),
    studyCode: text('studyCode').notNull(),
    name: text("name").notNull(),
    departmentId: integer("departmentId").notNull(),
});
export type FieldOfStudy = typeof fieldsOfStudySchema.$inferSelect;
export type NewFieldOfStudy = typeof fieldsOfStudySchema.$inferInsert;
