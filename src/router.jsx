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
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ChangePassword from "./pages/ChangePassword";
import Unauthorized from "./pages/Unauthorized";
import {
  redirectIfAuthenticated,
  requireAuth,
  resolveInitialRoute,
} from "./features/auth/session";

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
  beforeLoad: async () => {
    throw redirect({ to: await resolveInitialRoute(), replace: true });
  },
  component: () => null,
});

// ─────────────────────────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: redirectIfAuthenticated(),
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: redirectIfAuthenticated(),
  component: RegisterPage,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  beforeLoad: requireAuth({ allowUnverified: true }),
  component: VerifyEmailPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  validateSearch: (search) => ({
    step: search.step ?? "1",
    email: search.email ?? "",
    code: search.code ?? "",
  }),
  component: ForgotPasswordPage,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unauthorized",
  beforeLoad: requireAuth(),
  component: Unauthorized,
});

// ─────────────────────────────────────────────────────────────────
// Protected routes (token + email verified)
// ─────────────────────────────────────────────────────────────────
const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  beforeLoad: requireAuth(),
  component: Welcome,
});

const residentesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/residentes",
  beforeLoad: requireAuth(),
  component: Residentes,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  beforeLoad: requireAuth(),
  component: Chat,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  beforeLoad: requireAuth(),
  component: Notifications,
});

const notificationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications/$id",
  beforeLoad: requireAuth(),
  component: NotificationDetail,
});

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/change-password",
  beforeLoad: requireAuth(),
  component: ChangePassword,
});

// ─────────────────────────────────────────────────────────────────
// Admin routes (token + email verified + admin role)
// ─────────────────────────────────────────────────────────────────
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: requireAuth({ roles: ["Administrador"] }),
  component: AdminDashboard,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  beforeLoad: requireAuth({ roles: ["Administrador"] }),
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
  forgotPasswordRoute,
  unauthorizedRoute,
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
