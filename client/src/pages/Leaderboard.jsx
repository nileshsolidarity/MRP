import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { testApi } from '../services/api';
import { Trophy, Loader2 } from 'lucide-react';
import LeaderboardTable from '../components/Test/LeaderboardTable';

export default function Leaderboard() {
  const { branch } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApi.getGlobalLeaderboard()
      .then(setLeaderboard)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-600 text-white p-2 rounded-lg">
          <Trophy size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Leaderboard</h1>
          <p className="text-sm text-gray-500">Best scores across all process tests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <LeaderboardTable entries={leaderboard} currentBranchCode={branch?.code} global />
        )}
      </div>
    </div>
  );
}
