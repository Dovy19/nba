import { Team, NBA_TEAMS } from '@/lib/data/teams';
import { CompactTeamList } from './compact-team-list';
import { formatTimestamp } from '@/lib/utils/date';
import { getTeamsByIds } from '@/lib/utils/team-helpers';
import { Card } from '@/components/ui/card';

interface PredictionCardProps {
  username: string;
  eastConference: number[];
  westConference: number[];
  updatedAt: Date;
}

export function PredictionCard({
  username,
  eastConference,
  westConference,
  updatedAt,
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
        <CompactTeamList teams={eastTeams} title="Eastern Conference" />
        <CompactTeamList teams={westTeams} title="Western Conference" />
      </div>
    </Card>
  );
}