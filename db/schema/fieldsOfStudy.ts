import { serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import schema from '@db/schema/schema';
import { departmentsSchema } from '@db/schema/departments';

export const fieldsOfStudySchema = schema.table("fieldsOfStudy", {
    id: serial('id').primaryKey(),
    studyCode: text('studyCode').notNull(),
    name: text("name").notNull(),
    departmentId: integer("departmentId").notNull().references(() => departmentsSchema.id),
});

export const fieldsOfStudyRelations = relations(fieldsOfStudySchema, ({ one, many }) => ({
    department: one(departmentsSchema, {
        fields: [fieldsOfStudySchema.departmentId],
        references: [departmentsSchema.id],
    })
  }));

export type FieldOfStudy = typeof fieldsOfStudySchema.$inferSelect;
export type NewFieldOfStudy = typeof fieldsOfStudySchema.$inferInsert;
