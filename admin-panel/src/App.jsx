import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import ManageTests from "./pages/ManageTests";
import Profile from "./pages/Profile";
import "./App.css";

const isAuthed = () => Boolean(localStorage.getItem("labAdminToken"));

const RequireAuth = ({ children }) => {
  if (!isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
};

const AuthedLayout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 pt-14 md:pt-0">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthed() ? "/admin/dashboard" : "/admin/login"} replace />}
        />
        <Route
          path="/admin/login"
          element={isAuthed() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AuthedLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tests" element={<ManageTests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
