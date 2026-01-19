
import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

export const decks = pgTable('decks', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(), // Clerk User ID
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const cards = pgTable('cards', {
    id: serial('id').primaryKey(),
    deckId: integer('deck_id').references(() => decks.id, { onDelete: 'cascade' }).notNull(),
    front: text('front').notNull(),
    back: text('back').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});
