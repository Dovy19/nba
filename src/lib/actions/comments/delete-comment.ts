'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq, and } from 'drizzle-orm';

export async function deleteComment(commentId: number) {
  try {
    // Get current user
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "You must be logged in" };
    }

    // Delete comment (only if it belongs to the user)
    const result = await db
      .delete(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, session.user.id)
        )
      )
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Comment not found or you don't have permission" };
    }

    // Revalidate homepage
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error: "Failed to delete comment" };
  }
}