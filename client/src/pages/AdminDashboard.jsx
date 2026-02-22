import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import {
  Shield, Users, Clock, Award, TrendingUp, Loader2,
  ChevronDown, ChevronRight, CheckCircle, XCircle, UserCheck, UserX, Activity,
  AlertCircle, Copy, ExternalLink
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, sub }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colors[color]}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function EmployeeRow({ user, onToggle, isExpanded, activity }) {
  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer transition"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            <div>
              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
        <td className="px-4 py-3 text-sm text-gray-700 text-center">{user.stats.totalAttempts}</td>
        <td className="px-4 py-3 text-center">
          {user.stats.totalAttempts > 0 ? (
            <span className={`text-sm font-semibold ${user.stats.avgPercentage >= 80 ? 'text-green-600' : user.stats.avgPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {user.stats.avgPercentage}%
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {user.stats.totalAttempts > 0 ? (
            <span className="text-sm text-gray-700">{user.stats.passRate}%</span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 text-center">{user.stats.pillarsTested}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(user.stats.lastActivityAt || user.activatedAt)}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="px-4 py-0">
            <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
              {!activity ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-blue-500" />
                </div>
              ) : activity.attempts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-3">No assessment attempts yet</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assessment History</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase">
                        <th className="text-left pb-2">Pillar</th>
                        <th className="text-left pb-2">Module</th>
                        <th className="text-center pb-2">Score</th>
                        <th className="text-center pb-2">Result</th>
                        <th className="text-right pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.attempts.map((a, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="py-2 text-gray-700">{a.pillar_title}</td>
                          <td className="py-2 text-gray-500">{a.module_id === 'all' ? 'Full Pillar' : `Module ${a.module_id}`}</td>
                          <td className="py-2 text-center">
                            <span className={`font-semibold ${a.percentage >= 80 ? 'text-green-600' : a.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {a.score}/{a.total} ({a.percentage}%)
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            {a.passed ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                <CheckCircle size={14} /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                                <XCircle size={14} /> Fail
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-right text-gray-400 text-xs">{new Date(a.completed_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function PendingApprovals({ pendingUsers, onAction }) {
  const [processing, setProcessing] = useState({});
  const [results, setResults] = useState({});

  const handleAction = async (email, action) => {
    setProcessing(prev => ({ ...prev, [email]: action }));
    try {
      const data = await adminApi.approveUser(email, action);
      setResults(prev => ({ ...prev, [email]: data }));
      if (onAction) onAction();
    } catch (err) {
      setResults(prev => ({ ...prev, [email]: { error: err.message } }));
    } finally {
      setProcessing(prev => ({ ...prev, [email]: null }));
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
  };

  if (pendingUsers.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-yellow-200 overflow-hidden mb-8">
      <div className="px-5 py-4 border-b border-yellow-100 bg-yellow-50 flex items-center gap-2">
        <AlertCircle size={18} className="text-yellow-600" />
        <h2 className="font-semibold text-yellow-800">Pending Registrations</h2>
        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full ml-1">{pendingUsers.length}</span>
      </div>
      <div className="divide-y divide-gray-50">
        {pendingUsers.map(user => {
          const result = results[user.email];
          const isProcessing = processing[user.email];

          return (
            <div key={user.email} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Registered {timeAgo(user.createdAt)}</p>
                </div>
                {result ? (
                  <div className="text-right">
                    {result.error ? (
                      <p className="text-sm text-red-600">{result.error}</p>
                    ) : (
                      <div>
                        <p className="text-sm text-green-600 font-medium">{result.message}</p>
                        {result.setPasswordUrl && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => copyLink(result.setPasswordUrl)}
                              className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                            >
                              <Copy size={12} /> Copy Password Link
                            </button>
                            <a
                              href={result.setPasswordUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                            >
                              <ExternalLink size={12} /> Open
                            </a>
                            {!result.emailSent && (
                              <span className="text-xs text-yellow-600">(Email not sent — share link manually)</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(user.email, 'approve')}
                      disabled={!!isProcessing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {isProcessing === 'approve' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(user.email, 'reject')}
                      disabled={!!isProcessing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {isProcessing === 'reject' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [userActivities, setUserActivities] = useState({});
  const [error, setError] = useState('');

  const loadData = () => {
    return Promise.all([adminApi.getDashboard(), adminApi.getUsers()])
      .then(([d, u]) => { setDashboard(d); setUsers(u); })
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData().finally(() => setLoading(false));
  }, [isAdmin]);

  const refreshAfterAction = () => {
    loadData();
  };

  const toggleUser = async (email) => {
    if (expandedEmail === email) {
      setExpandedEmail(null);
      return;
    }
    setExpandedEmail(email);
    if (!userActivities[email]) {
      try {
        const data = await adminApi.getUserActivity(email);
        setUserActivities(prev => ({ ...prev, [email]: data }));
      } catch { /* ignore */ }
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Shield size={48} className="mx-auto text-red-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500">This dashboard is only available to admin users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Shield size={48} className="mx-auto text-red-300 mb-4" />
        <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Employee activity and assessment performance</p>
        </div>
      </div>

      {/* Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={UserCheck} label="Active Employees" value={dashboard.activeUsers} color="green" sub={`${dashboard.totalUsers} total`} />
          <StatCard icon={UserX} label="Pending Approvals" value={dashboard.pendingUsers} color="yellow" />
          <StatCard icon={Award} label="Tests Taken" value={dashboard.totalAssessmentAttempts} color="blue" />
          <StatCard icon={TrendingUp} label="Avg Score" value={`${dashboard.avgScore}%`} color="purple" sub={`${dashboard.passRate}% pass rate`} />
        </div>
      )}

      {/* Pending Approvals */}
      <PendingApprovals
        pendingUsers={users.filter(u => u.status === 'pending')}
        onAction={refreshAfterAction}
      />

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">All Employees</h2>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">{users.length}</span>
        </div>
        {users.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">No registered employees yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">Tests</th>
                  <th className="text-center px-4 py-3">Avg Score</th>
                  <th className="text-center px-4 py-3">Pass Rate</th>
                  <th className="text-center px-4 py-3">Pillars</th>
                  <th className="text-left px-4 py-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <EmployeeRow
                    key={u.email}
                    user={u}
                    isExpanded={expandedEmail === u.email}
                    onToggle={() => toggleUser(u.email)}
                    activity={userActivities[u.email]}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {dashboard && dashboard.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {dashboard.recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {a.passed ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle size={16} className="text-red-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.user_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">
                      {a.pillar_title} {a.module_id !== 'all' ? `- Module ${a.module_id}` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${a.percentage >= 80 ? 'text-green-600' : a.percentage >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {a.percentage}%
                  </p>
                  <p className="text-xs text-gray-400">{timeAgo(a.completed_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
