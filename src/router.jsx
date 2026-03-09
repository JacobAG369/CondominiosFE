import {
    createRootRoute,
    createRoute,
    createRouter,
    redirect,
    Outlet,
} from "@tanstack/react-router";

// ── Pages (existing) ──────────────────────────────────────────────
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Residentes from "./pages/Residentes";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import NotificationDetail from "./pages/NotificationDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";

// ── Auth Feature ──────────────────────────────────────────────────
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import ChangePassword from "./pages/ChangePassword";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function getToken() {
    return localStorage.getItem("token");
}

function isEmailVerified() {
    return localStorage.getItem("email_verified") === "true";
}

function isAdmin() {
    return localStorage.getItem("admin") === "true";
}

/**
 * Guard for routes that require authentication AND email verification.
 */
function requireAuth({ location }) {
    const token = getToken();
    if (!token) {
        throw redirect({ to: "/login", replace: true });
    }
    if (!isEmailVerified()) {
        throw redirect({ to: "/verify-email", replace: true });
    }
}

/**
 * Guard for admin-only routes.
 */
function requireAdmin({ location }) {
    requireAuth({ location });
    if (!isAdmin()) {
        throw redirect({ to: "/welcome", replace: true });
    }
}

// ─────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// ─────────────────────────────────────────────────────────────────
// Index → smart redirect
// ─────────────────────────────────────────────────────────────────
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: () => {
        const token = getToken();
        if (!token) throw redirect({ to: "/login", replace: true });
        if (!isEmailVerified()) throw redirect({ to: "/verify-email", replace: true });
        if (isAdmin()) throw redirect({ to: "/admin", replace: true });
        throw redirect({ to: "/welcome", replace: true });
    },
    component: () => null,
});

// ─────────────────────────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────────────────────────
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: RegisterPage,
});

const verifyEmailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/verify-email",
    component: VerifyEmailPage,
});

// ─────────────────────────────────────────────────────────────────
// Protected routes (token + email verified)
// ─────────────────────────────────────────────────────────────────
const welcomeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/welcome",
    beforeLoad: requireAuth,
    component: Welcome,
});

const residentesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/residentes",
    beforeLoad: requireAuth,
    component: Residentes,
});

const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/chat",
    beforeLoad: requireAuth,
    component: () => (
        <Chat depaId={Number(localStorage.getItem("depa_id"))} />
    ),
});

const notificationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/notifications",
    beforeLoad: requireAuth,
    component: Notifications,
});

const notificationDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/notifications/$id",
    beforeLoad: requireAuth,
    component: NotificationDetail,
});

const changePasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/change-password",
    beforeLoad: requireAuth,
    component: ChangePassword,
});

// ─────────────────────────────────────────────────────────────────
// Admin routes (token + email verified + admin role)
// ─────────────────────────────────────────────────────────────────
const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin",
    beforeLoad: requireAdmin,
    component: AdminDashboard,
});

const adminUsersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin/users",
    beforeLoad: requireAdmin,
    component: Users,
});

// ─────────────────────────────────────────────────────────────────
// Catch-all → index
// ─────────────────────────────────────────────────────────────────
const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "*",
    beforeLoad: () => {
        throw redirect({ to: "/", replace: true });
    },
    component: () => null,
});

// ─────────────────────────────────────────────────────────────────
// Build router
// ─────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    verifyEmailRoute,
    welcomeRoute,
    residentesRoute,
    chatRoute,
    notificationsRoute,
    notificationDetailRoute,
    changePasswordRoute,
    adminRoute,
    adminUsersRoute,
    notFoundRoute,
]);

export const router = createRouter({ routeTree });
