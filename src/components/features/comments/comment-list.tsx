import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

interface Comment {
  id: number;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface CommentListProps {
  predictionId: string;
  comments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: string;
}

export function CommentList({ predictionId, comments, isLoggedIn, currentUserId }: CommentListProps) {
  return (
    <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
      <h4 className="text-lg font-semibold text-white mb-4">
        Comments ({comments.length})
      </h4>

      {/* Comment Form - Only show if logged in */}
      {isLoggedIn && (
        <div className="mb-6">
          <CommentForm predictionId={predictionId} />
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              commentId={comment.id}
              username={comment.username}
              content={comment.content}
              createdAt={comment.createdAt}
              isOwner={currentUserId === comment.userId}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}