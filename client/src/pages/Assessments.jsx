import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assessmentApi } from '../services/api';
import { BookOpen, ChevronRight, Users, Clock, Award, ArrowLeft, Loader2, Trophy, CheckCircle } from 'lucide-react';
import LeaderboardTable from '../components/Test/LeaderboardTable';
import { useAuth } from '../context/AuthContext';

const PILLAR_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-600' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-600' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'bg-amber-600' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-600' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'bg-rose-600' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'bg-cyan-600' },
];

export default function Assessments() {
  const { pillarId } = useParams();
  const { branch } = useAuth();
  const [pillars, setPillars] = useState([]);
  const [rules, setRules] = useState(null);
  const [pillarDetail, setPillarDetail] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pillarId) {
      loadPillarDetail();
    } else {
      loadPillars();
    }
  }, [pillarId]);

  async function loadPillars() {
    setLoading(true);
    try {
      const data = await assessmentApi.getPillars();
      setPillars(data.pillars);
      setRules(data.rules);
    } catch (err) {
      console.error('Failed to load pillars:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPillarDetail() {
    setLoading(true);
    try {
      const [detail, lb] = await Promise.all([
        assessmentApi.getPillarDetail(pillarId),
        assessmentApi.getLeaderboard(pillarId).catch(() => []),
      ]);
      setPillarDetail(detail);
      setLeaderboard(lb);
    } catch (err) {
      console.error('Failed to load pillar detail:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  // Pillar Detail View
  if (pillarId && pillarDetail) {
    const color = PILLAR_COLORS[(pillarDetail.id - 1) % PILLAR_COLORS.length];
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/assessments" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
          <ArrowLeft size={16} />
          Back to Assessments
        </Link>

        <div className={`${color.bg} ${color.border} border rounded-xl p-6 mb-6`}>
          <div className="flex items-start gap-4">
            <div className={`${color.icon} text-white p-3 rounded-lg`}>
              <BookOpen size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold ${color.text} uppercase tracking-wider`}>Pillar {pillarDetail.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border}`}>{pillarDetail.certification}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{pillarDetail.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Users size={14} />{pillarDetail.audience}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{pillarDetail.timeMinutes} mins total</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} />{pillarDetail.passMark}% to pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Modules</h2>
        <div className="space-y-3 mb-8">
          {pillarDetail.modules.map((mod, idx) => (
            <div key={mod.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${color.icon} text-white rounded-lg flex items-center justify-center font-bold text-sm`}>
                    {mod.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{mod.questionCount} MCQs</span>
                      {mod.scenarioCount > 0 && <span>{mod.scenarioCount} Scenarios</span>}
                      <span>{mod.duration} mins</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/assessments/${pillarDetail.id}/${mod.id}/test`}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Start Test
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Full Pillar Test */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Full Pillar Assessment</h3>
              <p className="text-sm text-gray-400 mt-1">
                All {pillarDetail.modules.reduce((s, m) => s + m.questionCount, 0)} questions across all modules
              </p>
            </div>
            <Link
              to={`/assessments/${pillarDetail.id}/all/test`}
              className="flex items-center gap-1 px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-100 transition"
            >
              <Award size={16} />
              Take Full Test
            </Link>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            Pillar Leaderboard
          </h3>
          <LeaderboardTable entries={leaderboard} currentBranchCode={branch?.code} />
        </div>
      </div>
    );
  }

  // Pillars Hub View
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training Assessments</h1>
        <p className="text-sm text-gray-500 mt-1">
          6 Pillars &bull; 245 MCQs &bull; 15 Scenarios &bull; {rules?.passMark}% Pass Mark
        </p>
      </div>

      {/* Rules Card */}
      {rules && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-8 text-white">
          <h2 className="font-bold text-lg mb-3">Certification Rules</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{rules.passMark}%</div>
              <div className="text-blue-100">Pass Mark</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{rules.managerPassMark}%</div>
              <div className="text-blue-100">Manager Pass</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{rules.maxAttempts}</div>
              <div className="text-blue-100">Max Attempts</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{rules.validityMonths}m</div>
              <div className="text-blue-100">Cert Validity</div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((pillar, idx) => {
          const color = PILLAR_COLORS[idx % PILLAR_COLORS.length];
          return (
            <Link
              key={pillar.id}
              to={`/assessments/${pillar.id}`}
              className={`${color.bg} ${color.border} border rounded-xl p-5 hover:shadow-lg transition group`}
            >
              <div className="flex items-start gap-4">
                <div className={`${color.icon} text-white p-3 rounded-lg`}>
                  <BookOpen size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${color.text} uppercase tracking-wider`}>Pillar {pillar.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{pillar.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{pillar.moduleCount} modules</span>
                    <span>{pillar.questionCount} MCQs</span>
                    <span>{pillar.timeMinutes} mins</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border} font-medium`}>
                      {pillar.certification}
                    </span>
                    <span className="text-xs text-gray-400">{pillar.audience}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition mt-2" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
