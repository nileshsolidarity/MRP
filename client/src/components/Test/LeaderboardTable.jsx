import { Trophy, Medal, Award } from 'lucide-react';

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy size={16} className="text-yellow-500" />;
  if (rank === 2) return <Medal size={16} className="text-gray-400" />;
  if (rank === 3) return <Award size={16} className="text-orange-400" />;
  return <span className="text-sm text-gray-500 w-4 text-center">{rank}</span>;
}

export default function LeaderboardTable({ entries, currentBranchCode, global = false }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Trophy size={40} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm">No test attempts yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 text-gray-500 font-medium">Rank</th>
            <th className="text-left py-3 px-3 text-gray-500 font-medium">Branch</th>
            {global ? (
              <>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Tests Taken</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Avg Score</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Passed</th>
              </>
            ) : (
              <>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Score</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Percentage</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">Status</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className={`border-b border-gray-100 ${
                entry.branch_code === currentBranchCode ? 'bg-blue-50' : ''
              }`}
            >
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <RankIcon rank={entry.rank} />
                </div>
              </td>
              <td className="py-3 px-3">
                <div>
                  <p className="font-medium text-gray-900">{entry.branch_name}</p>
                  <p className="text-xs text-gray-400">{entry.branch_code}</p>
                </div>
              </td>
              {global ? (
                <>
                  <td className="py-3 px-3 text-center text-gray-700">{entry.tests_taken}</td>
                  <td className="py-3 px-3 text-center font-semibold text-gray-900">{entry.average_percentage}%</td>
                  <td className="py-3 px-3 text-center text-gray-700">{entry.tests_passed}</td>
                </>
              ) : (
                <>
                  <td className="py-3 px-3 text-center text-gray-700">{entry.score}/{entry.total}</td>
                  <td className="py-3 px-3 text-center font-semibold text-gray-900">{entry.percentage}%</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      entry.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
