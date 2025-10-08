import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and } from 'drizzle-orm';
import * as schema from './schema';

// Load environment variables
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Import tables from schema
const { users, predictions } = schema;

/**
 * Get user by username
 */
export async function getUser(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(id)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get a user's prediction for a specific season
 */
export async function getUserPrediction(userId: string, season: string) {
  const result = await db
    .select()
    .from(predictions)
    .where(
      and(
        eq(predictions.userId, userId),
        eq(predictions.season, season)
      )
    )
    .limit(1);

  return result[0] || null;
}

/**
 * Get all predictions for a specific season
 */
export async function getAllPredictions(season: string) {
  const result = await db
    .select()
    .from(predictions)
    .where(eq(predictions.season, season));

  return result;
}