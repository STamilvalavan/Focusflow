import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[color:var(--ff-page-bg)] text-[color:var(--ff-text)]"
      data-theme={theme}
    >
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            currentUser ? <Dashboard /> : <Navigate to="/signup" replace />
          }
        />
        <Route
          path="*"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;