import { serial, text, integer, numeric, date } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { relations } from 'drizzle-orm';
import { usersSchema } from '@db/schema/users';
import schema from '@db/schema/schema';
import { z } from "zod";

import { isScaleTwoDecimalNumber, isValidNorwegiaAccountNumberNoIBAN, removeSeparatorsNorwegianAccountNumberNoIBAN } from '@src/parsing/moneyParser';

export const recieptsSchema = schema.table("reciepts", {
    id: serial('id').primaryKey(),
    userId: integer("userId").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    moneyAmount: numeric("moneyAmount", {scale: 2}).notNull(),
    accountNumber: text("accountNumber").notNull(),
    purchaseDate: date("purchaseDate", {mode: "date"}).notNull(),
    submitDate: date("submitDate", {mode: "date"}).defaultNow().notNull(),
    payBackDate: date("payBackDate", {mode: "date"}),
});

export const reciptsRelations = relations(recieptsSchema, ({ one }) => ({
    user: one(usersSchema, {
        fields: [recieptsSchema.userId],
        references: [usersSchema.id],
    }),
  }));

export type Reciept = typeof recieptsSchema.$inferSelect;
export type NewReciept = typeof recieptsSchema.$inferInsert;

export const recieptInsertSchema = createInsertSchema(recieptsSchema, {
    userId: (schema) => schema.userId.finite().safe().nonnegative().int(),
    title: (schema) => schema.title.min(1),
    description: (schema) => schema.description.min(1),
    moneyAmount: (schema) => schema.moneyAmount.trim().refine(isScaleTwoDecimalNumber, {
        message: "Not a scale 2 decimal number.",
    }),
    accountNumber: (schema) => schema.accountNumber.refine(isValidNorwegiaAccountNumberNoIBAN),
    purchaseDate: (schema) => schema.purchaseDate.max(new Date()),
}).omit({
    id: true,
    submitDate: true,
    payBackDate: true,
});