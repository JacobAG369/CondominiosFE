import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Residentes from "./pages/Residentes";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import NotificationDetail from "./pages/NotificationDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function HomeRedirect() {
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin") === "true";

  if (!token) return <Navigate to="/login" replace />;
  if (admin) return <Navigate to="/admin" replace />;
  return <Navigate to="/welcome" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Normal User Routes */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

      {/* Shared Routes (both admin and normal users) */}
      <Route
        path="/residentes"
        element={
          <ProtectedRoute>
            <Residentes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat depaId={Number(localStorage.getItem("depa_id"))} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications/:id"
        element={
          <ProtectedRoute>
            <NotificationDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
