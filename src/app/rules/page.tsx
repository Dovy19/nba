import { Card } from '@/components/ui/card';
import { ExamplesCarousel } from '@/components/features/rules/examples-carousel';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-lg text-gray-400">
            Predict the NBA standings and earn points based on accuracy
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* How to Play */}
          <Card className="p-8 bg-[#1E1E1E] border-[#2A2A2A]">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How to Play
            </h2>
            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p>
                Before the season starts (deadline: <strong className="text-white">November 1, 2025 at 2:30 AM EET</strong>), 
                rank all 30 NBA teams in order from 1st to 15th place in each conference.
              </p>
              <p>
                Use the drag-and-drop interface to arrange teams. For teams in the <strong className="text-white">play-in positions (seeds 7-10)</strong>, 
                you must also assign badges to indicate whether they'll make the playoffs or be eliminated.
              </p>
              <p>
                You can edit your prediction as many times as you want until the deadline.
              </p>
              <p>
                After the season ends (including play-in games), we'll calculate your score 
                based on how accurate your predictions were.
              </p>
            </div>
          </Card>

          {/* Scoring System */}
          <Card className="p-8 bg-[#1E1E1E] border-[#2A2A2A]">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Scoring System
            </h2>
            <p className="text-gray-300 mb-6">
              You can earn up to <strong className="text-white">3 points per team</strong> (90 points total):
            </p>

            <div className="space-y-6">
              {/* Point 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Exact Seed Match
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Did you predict the exact final standing? (e.g., predicted 3rd place, finished 3rd place)
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Correct Category
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Did you place them in the right tier?
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• <strong className="text-white">Seeds 1-6:</strong> Playoffs secured</li>
                    <li>• <strong className="text-white">Seeds 7-10:</strong> Play-in tournament</li>
                    <li>• <strong className="text-white">Seeds 11-15:</strong> Out of playoffs</li>
                  </ul>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Correct Playoff Outcome
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Did they ultimately make the playoffs or miss them?
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• <strong className="text-white">Seeds 1-6:</strong> Automatically "made playoffs"</li>
                    <li>• <strong className="text-white">Seeds 7-10:</strong> Based on your badge prediction:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>🟡 Badge "Makes Playoffs" + they win play-in → point earned</li>
                        <li>🔴 Badge "Out" + they lose play-in → point earned</li>
                      </ul>
                    </li>
                    <li>• <strong className="text-white">Seeds 11-15:</strong> Automatically "out"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-200">
                <strong>💡 Pro Tip:</strong> The play-in badges are crucial! Correctly predicting which play-in teams 
                will make the playoffs can be the difference between winning and losing.
              </p>
            </div>
          </Card>

          {/* Example */}
          <Card className="p-8 bg-[#1E1E1E] border-[#2A2A2A]">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Examples
            </h2>
            <ExamplesCarousel />
          </Card>

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>
              The user with the highest total score at the end of the season wins! 🏆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}