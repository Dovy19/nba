import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { getAllPredictions, getUserById, getCommentsByPrediction } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { PredictionCard } from '@/components/features/predictions/prediction-card';
import { ParallaxHero } from '@/components/shared/parallax-background';
import { CURRENT_SEASON } from '@/lib/utils/constants';

export default async function HomePage() {
  const session = await getSession();
  
  // Fetch all predictions for current season
  const predictions = await getAllPredictions(CURRENT_SEASON);
  
  // Fetch usernames and comments for each prediction
  const predictionsWithData = await Promise.all(
    predictions.map(async (prediction) => {
      const user = await getUserById(prediction.userId);
      const comments = await getCommentsByPrediction(prediction.id);
      
      // Get usernames for each comment
      const commentsWithUsernames = await Promise.all(
        comments.map(async (comment) => {
          const commentUser = await getUserById(comment.userId);
          return {
            ...comment,
            username: commentUser?.username || 'Unknown User',
          };
        })
      );
      
      return {
        ...prediction,
        username: user?.username || 'Unknown User',
        comments: commentsWithUsernames,
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Parallax Hero Section */}
      <ParallaxHero 
        imageUrl="/lebron-cover.jpg"
        session={session}
      />

      {/* Main Content - Predictions */}
      <div className="relative bg-[#121212]">
        <div className="container mx-auto px-4 py-16">
          {/* Predictions Grid */}
          {predictionsWithData.length > 0 ? (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                All Predictions
              </h2>
              {/* 2 columns on desktop, 1 on mobile */}
              <div className="grid md:grid-cols-2 gap-6">
                {predictionsWithData.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    predictionId={prediction.id}
                    username={prediction.username}
                    eastConference={prediction.eastConference}
                    westConference={prediction.westConference}
                    updatedAt={prediction.updatedAt}
                    comments={prediction.comments}
                    isLoggedIn={!!session?.user}
                    playInOutcomes={prediction.playInOutcomes as Record<number, 'makes_playoffs' | 'out_in_playins'> || {}}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-100 text-lg">
                No predictions yet. Be the first to make one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}