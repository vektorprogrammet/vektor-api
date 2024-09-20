import { serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import schema from '@db/schema/schema';

import { fieldsOfStudySchema } from '@db/schema/fieldsOfStudy';
import { recieptsSchema } from '@db/schema/reciepts';

export const usersSchema = schema.table("users", {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text("lastName").notNull(),
    fieldOfStudyId: integer("fieldOfStudyId").notNull().references(() => fieldsOfStudySchema.id),
});

export const usersRelations = relations(usersSchema, ({ one, many }) => ({
    fieldOfStudy: one(fieldsOfStudySchema, {
        fields: [usersSchema.fieldOfStudyId],
        references: [fieldsOfStudySchema.id],
    }),
    reciepts: many(recieptsSchema)
  }));


export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
