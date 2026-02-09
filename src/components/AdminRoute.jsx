import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin") === "true";

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!admin) {
        return <Navigate to="/welcome" replace />;
    }

    return children;
}
