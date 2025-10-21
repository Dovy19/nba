'use client';

import { useState, useTransition } from 'react';
import { formatRelativeTime } from '@/lib/utils/date';
import { deleteComment } from '@/lib/actions/comments/delete-comment';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface CommentItemProps {
  commentId: number;
  username: string;
  content: string;
  createdAt: Date;
  isOwner: boolean;
}

export function CommentItem({ commentId, username, content, createdAt, isOwner }: CommentItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteComment(commentId);
      
      if (result.success) {
        setIsDeleted(true);
        toast.success('Comment deleted');
      } else {
        toast.error(result.error || 'Failed to delete comment');
      }
    });
  };

  if (isDeleted) {
    return null; // Hide deleted comment immediately
  }

  return (
    <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative group">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-white">
          {username}
        </span>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(createdAt)}
        </span>
        
        {/* Delete Button - Only show for comment owner */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="ml-auto text-white hover:text-red-500 transition-colors cursor-pointer"
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
}