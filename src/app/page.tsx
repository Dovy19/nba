import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { getAllPredictions, getUserById } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { PredictionCard } from '@/components/features/predictions/prediction-card';
import { CURRENT_SEASON } from '@/lib/utils/constants';

export default async function HomePage() {
  const session = await getSession();
  
  // Fetch all predictions for current season
  const predictions = await getAllPredictions(CURRENT_SEASON);
  
  // Fetch usernames for each prediction
  const predictionsWithUsers = await Promise.all(
    predictions.map(async (prediction) => {
      const user = await getUserById(prediction.userId);
      return {
        ...prediction,
        username: user?.username || 'Unknown User',
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            NBA Standings Predictions
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Predict how the 2024-25 NBA season will play out. Drag and drop teams to rank them, then see how your predictions stack up against your friends.
          </p>
          
          {session?.user ? (
            <div className="flex gap-4 justify-center">
              <Link href="/predictions/new">
                <Button size="lg" className="text-lg">
                  Make a Prediction
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button size="lg" className="text-lg">
                Login to Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Predictions Grid */}
        {predictionsWithUsers.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              All Predictions
            </h2>
            {/* 2 columns on desktop, 1 on mobile */}
            <div className="grid md:grid-cols-2 gap-6">
              {predictionsWithUsers.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  username={prediction.username}
                  eastConference={prediction.eastConference}
                  westConference={prediction.westConference}
                  updatedAt={prediction.updatedAt}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No predictions yet. Be the first to make one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}