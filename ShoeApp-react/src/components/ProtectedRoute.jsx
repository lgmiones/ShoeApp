import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

// 🧩 ProtectedRoute component: used to restrict access to certain pages
export default function ProtectedRoute({ children, requireAdmin = false }) {
  // Destructure authentication state from the AuthContext
  const { ready, isAuthed, isAdmin } = useAuth();

  // 🕒 If authentication state is still being checked, don't render anything yet
  // This prevents flickering or showing protected content before knowing the user's status
  if (!ready) return null;

  // 🚫 If user is not logged in, redirect them to the login page
  if (!isAuthed) return <Navigate to="/login" replace />;

  // 🔐 If the route requires admin access but the user isn't an admin,
  // redirect them to the home page or another safe location
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  // ✅ If user passes all checks, render the protected page (children)
  return children;
}
