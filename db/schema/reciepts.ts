import { serial, text, integer, numeric, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersSchema } from '@db/schema/users';
import schema from '@db/schema/schema';

export const recieptsSchema = schema.table("reciepts", {
    id: serial('id').primaryKey(),
    userId: integer("userId").notNull(),
    title: text("title").notNull(),
    moneyAmount: numeric("moneyAmount").notNull(),
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
