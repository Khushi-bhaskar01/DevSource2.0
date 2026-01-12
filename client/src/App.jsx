import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";

import Home from "./pages/Home";
import Members from "./pages/Members";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
              <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute>
              <Members />
              </ProtectedRoute>
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
          
        </Routes>
      </Router>
    
  );
}
