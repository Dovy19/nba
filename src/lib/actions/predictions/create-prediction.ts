'use server';

import { revalidatePath } from 'next/cache';
import { db, getUserPrediction } from '@/lib/db';
import { predictions } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { predictionSchema } from '@/lib/validations/prediction';
import { isBeforeDeadline } from '@/lib/utils/date';
import { SEASON_START_DATE, CURRENT_SEASON } from '@/lib/utils/constants';
import { eq, and } from 'drizzle-orm';

export async function createPrediction(data: unknown) {
  try {
    // Get current user
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "You must be logged in" };
    }

    // Check deadline
    if (!isBeforeDeadline(SEASON_START_DATE)) {
      return { success: false, error: "The deadline has passed. Predictions are locked." };
    }

    // Debug log incoming data
    console.log('📥 Incoming prediction data:', JSON.stringify(data, null, 2));

    // Validate input
    const validated = predictionSchema.parse(data);
    
    console.log('✅ Validation passed:', validated);

    // Check if user already has a prediction for this season
    const existingPrediction = await getUserPrediction(session.user.id, CURRENT_SEASON);

    if (existingPrediction) {
      // Update existing prediction
      await db
        .update(predictions)
        .set({
          eastConference: validated.eastConference,
          westConference: validated.westConference,
          playInOutcomes: validated.playInOutcomes || {},
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(predictions.userId, session.user.id),
            eq(predictions.season, CURRENT_SEASON)
          )
        );
    } else {
      // Create new prediction
      await db.insert(predictions).values({
        userId: session.user.id,
        season: validated.season,
        eastConference: validated.eastConference,
        westConference: validated.westConference,
        playInOutcomes: validated.playInOutcomes || {},
      });
    }

    // Revalidate homepage to show updated predictions
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Create prediction error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      console.error('Zod validation errors:', (error as any).errors);
      return { success: false, error: "Invalid prediction data" };
    }
    
    return { success: false, error: "Failed to save prediction. Please try again." };
  }
}