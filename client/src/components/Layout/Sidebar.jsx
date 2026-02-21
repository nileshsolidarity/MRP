import { Home, FileText, MessageSquare, FolderOpen, Trophy, BookOpen, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/processes', icon: FileText, label: 'Processes' },
  { to: '/assessments', icon: BookOpen, label: 'Assessments' },
  { to: '/chat', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-60 bg-gray-900 text-gray-300 flex flex-col min-h-0">
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-400 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="border-t border-gray-800 my-3" />
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-800 text-indigo-400 hover:text-white'
                }`
              }
            >
              <Shield size={18} />
              Admin Dashboard
            </NavLink>
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FolderOpen size={14} />
          <span>Connected to Google Drive</span>
        </div>
      </div>
    </aside>
  );
}
