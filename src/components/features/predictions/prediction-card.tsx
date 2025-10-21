import { Team, NBA_TEAMS } from '@/lib/data/teams';
import { CompactTeamList } from './compact-team-list';
import { formatTimestamp } from '@/lib/utils/date';
import { getTeamsByIds } from '@/lib/utils/team-helpers';
import { Card } from '@/components/ui/card';
import { CommentList } from '../comments/comment-list';

interface Comment {
  id: number;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface PredictionCardProps {
  predictionId: number;
  username: string;
  eastConference: number[];
  westConference: number[];
  updatedAt: Date;
  comments: Comment[];
  isLoggedIn: boolean;
  playInOutcomes?: Record<number, 'makes_playoffs' | 'out_in_playins'>;
}

export function PredictionCard({
  predictionId,
  username,
  eastConference,
  westConference,
  updatedAt,
  comments,
  isLoggedIn,
  playInOutcomes = {},
}: PredictionCardProps) {
  // Convert team IDs to Team objects
  const eastTeams = getTeamsByIds(eastConference, NBA_TEAMS);
  const westTeams = getTeamsByIds(westConference, NBA_TEAMS);

  return (
    <Card className="p-6 bg-[#1E1E1E] border-[#2A2A2A]">
      {/* Header with Username and Timestamp */}
      <div className="mb-4 pb-4 border-b border-[#2A2A2A]">
        <h2 className="text-xl font-semibold text-white mb-1">
          {username}'s Prediction
        </h2>
        <p className="text-sm text-gray-400">
          Submitted: {formatTimestamp(updatedAt)}
        </p>
      </div>

      {/* Two Conference Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        <CompactTeamList 
          teams={eastTeams} 
          title="Eastern Conference"
          playInOutcomes={playInOutcomes}
        />
        <CompactTeamList 
          teams={westTeams} 
          title="Western Conference"
          playInOutcomes={playInOutcomes}
        />
      </div>

      {/* Comments Section */}
      <CommentList 
        predictionId={predictionId.toString()} 
        comments={comments}
        isLoggedIn={isLoggedIn}
      />
    </Card>
  );
}