import { CheckCircle, XCircle, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestResults({ result, processId, onRetake }) {
  const { score, total, percentage, passed, answers } = result;

  return (
    <div>
      {/* Score Banner */}
      <div className={`rounded-xl p-6 mb-6 border ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {passed ? (
                <CheckCircle size={32} className="text-green-600" />
              ) : (
                <XCircle size={32} className="text-red-600" />
              )}
              <span className={`text-3xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {score}/{total}
              </span>
            </div>
            <p className={`text-lg font-medium ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {percentage}% — {passed ? 'PASSED' : 'NOT PASSED'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {passed ? 'Congratulations! You have passed this assessment.' : 'You need 80% or above to pass. Please review and try again.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
        >
          <RotateCcw size={16} />
          Retake Test
        </button>
        <Link
          to={`/processes/${processId}`}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={16} />
          Back to Process
        </Link>
        <Link
          to="/leaderboard"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
        >
          <Trophy size={16} />
          View Leaderboard
        </Link>
      </div>

      {/* Per-question Review */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
      <div className="space-y-3">
        {answers.map((a, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${a.is_correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}
          >
            <div className="flex items-start gap-3">
              {a.is_correct ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{a.question}</p>
                <p className="text-sm mt-1">
                  <span className="text-gray-500">Your answer: </span>
                  <span className={a.is_correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {a.user_answer || '(no answer)'}
                  </span>
                </p>
                {!a.is_correct && (
                  <>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">Correct answer: </span>
                      <span className="text-green-700 font-medium">{a.correct_answer}</span>
                    </p>
                    {a.explanation && (
                      <p className="text-xs text-gray-500 mt-1 italic">{a.explanation}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
