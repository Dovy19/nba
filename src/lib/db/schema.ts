import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  password: text('password').notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const predictions = pgTable('predictions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  season: text('season').notNull(),
  eastConference: jsonb('east_conference').notNull().$type<number[]>(),
  westConference: jsonb('west_conference').notNull().$type<number[]>(),
  playInOutcomes: jsonb('play_in_outcomes').$type<Record<number, 'makes_playoffs' | 'out_in_playins'>>().default({}), // ADD THIS LINE
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  predictionId: text('prediction_id').notNull(),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;