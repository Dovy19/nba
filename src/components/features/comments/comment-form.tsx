'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createComment } from '@/lib/actions/comments/create-comment';
import { toast } from 'sonner';

interface CommentFormProps {
  predictionId: string;
}

export function CommentForm({ predictionId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    startTransition(async () => {
      const result = await createComment(predictionId, content);
      
      if (result.success) {
        setContent(''); // Clear form
        toast.success('Comment posted!');
      } else {
        toast.error(result.error || 'Failed to post comment');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        maxLength={500}
        rows={3}
        disabled={isPending}
        className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {content.length}/500 characters
        </span>
        <Button 
          type="submit" 
          disabled={isPending || !content.trim()}
          size="sm"
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}