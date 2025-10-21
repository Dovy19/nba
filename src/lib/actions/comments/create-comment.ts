'use server';

import { revalidatePath } from 'next/cache';
import { createComment as createCommentDb } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function createComment(predictionId: string, content: string) {
  try {
    // Get current user
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to comment" };
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Comment cannot be empty" };
    }

    if (content.length > 500) {
      return { success: false, error: "Comment is too long (max 500 characters)" };
    }

    // Create comment
    await createCommentDb(predictionId, session.user.id, content.trim());

    // Revalidate homepage to show new comment
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Create comment error:', error);
    return { success: false, error: "Failed to post comment. Please try again." };
  }
}