import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Public Pages
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import ProjectWall from "./pages/ProjectWall";
// User Pages
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
              <Home />
          }
        />

        <Route
          path="/members"
          element={
              <Members />
          }
        />
        <Route
          path="/leaderboard"
          element={
              <Leaderboard />
          }
        />
        <Route
          path="/projects"
          element={
              <ProjectWall />
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Public read-only profile */}
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Private editable profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/tasks"
          element={
            <AdminProtectedRoute>
              <AdminTasks />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/submissions"
          element={
            <AdminProtectedRoute>
              <AdminSubmissions />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}