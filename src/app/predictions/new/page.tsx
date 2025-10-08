import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getTeamsByConference, NBA_TEAMS } from '@/lib/data/teams';
import { PredictionBuilder } from '@/components/features/predictions/prediction-builder';
import { isBeforeDeadline } from '@/lib/utils/date';
import { SEASON_START_DATE, CURRENT_SEASON } from '@/lib/utils/constants';
import { getUserPrediction } from '@/lib/db';
import { getTeamsByIds } from '@/lib/utils/team-helpers';

export default async function NewPredictionPage() {
  // Check authentication
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  // Check deadline
  if (!isBeforeDeadline(SEASON_START_DATE)) {
    redirect('/');
  }

  // Try to load existing prediction
  const existingPrediction = await getUserPrediction(session.user.id, CURRENT_SEASON);

  let eastTeams, westTeams;

  if (existingPrediction) {
    // Load user's existing rankings
    eastTeams = getTeamsByIds(existingPrediction.eastConference, NBA_TEAMS);
    westTeams = getTeamsByIds(existingPrediction.westConference, NBA_TEAMS);
  } else {
    // Start with alphabetical order
    eastTeams = getTeamsByConference('East');
    westTeams = getTeamsByConference('West');
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <PredictionBuilder
          initialEastTeams={eastTeams}
          initialWestTeams={westTeams}
          isEditing={!!existingPrediction}
        />
      </div>
    </div>
  );
}