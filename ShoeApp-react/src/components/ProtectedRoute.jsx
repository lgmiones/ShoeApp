import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { ready, isAuthed, isAdmin } = useAuth();
  if (!ready) return null; // let app load 'me'
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
