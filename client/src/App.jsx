import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import SetPassword from './pages/SetPassword';
import Home from './pages/Home';
import Processes from './pages/Processes';
import ProcessDetail from './pages/ProcessDetail';
import Chat from './pages/Chat';
import TestPage from './pages/TestPage';
import Leaderboard from './pages/Leaderboard';
import Assessments from './pages/Assessments';
import AssessmentTest from './pages/AssessmentTest';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/set-password/:token" element={<SetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="processes" element={<Processes />} />
            <Route path="processes/:id" element={<ProcessDetail />} />
            <Route path="processes/:id/test" element={<TestPage />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="assessments/:pillarId" element={<Assessments />} />
            <Route path="assessments/:pillarId/:moduleId/test" element={<AssessmentTest />} />
            <Route path="chat" element={<Chat />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
