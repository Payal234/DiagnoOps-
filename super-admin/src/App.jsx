import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ManageLab from './pages/ManageLab'
import Sidebar from './layout/Sidebar'

function App() {

  const hasToken = () => Boolean(localStorage.getItem('token'));

  const RequireAuth = () => {
    return hasToken() ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const PublicOnly = () => {
    return hasToken() ? <Navigate to="/dashboard" replace /> : <Outlet />;
  };

  const AuthedLayout = () => {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="min-h-screen px-4 py-6 md:ml-64">
          <Outlet />
        </main>
      </div>
    );
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={hasToken() ? '/dashboard' : '/login'} replace />} />

          <Route element={<PublicOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AuthedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lab" element={<ManageLab />} />

              {/* Backwards-compatible aliases */}
              <Route path="/super-admin/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/super-admin/lab" element={<Navigate to="/lab" replace />} />
              <Route path="/super-admin/Lab" element={<Navigate to="/lab" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
