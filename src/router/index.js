import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/aid-requests",
    name: "AidRequests",
    component: () => import("@/views/AidRequestsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/donations",
    name: "Donations",
    component: () => import("@/views/DonationsView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/distributions",
    name: "Distributions",
    component: () => import("@/views/DistributionsView.vue"),
    meta: { requiresAuth: true, requiresVolunteer: true },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("@/views/NotificationsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("@/views/UsersView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
  // Catch-all route for 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/HomeView.vue"), // Redirect to home for now
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log("[Router]", from.name || "N/A", "=>", to.name || "N/A", to.meta);
  }

  // Check authentication requirements
  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  // Guest-only pages
  if (to.meta?.guestOnly && authStore.isAuthenticated) {
    return next({ name: "Home" });
  }

  // Role-based access control
  if (to.meta?.requiresAdmin && authStore.user?.role !== "admin") {
    return next({ name: "Home" });
  }

  if (to.meta?.requiresVolunteer && !["admin", "volunteer"].includes(authStore.user?.role)) {
    return next({ name: "Home" });
  }

  if (to.meta?.requiresBeneficiary && authStore.user?.role !== "beneficiary") {
    return next({ name: "Home" });
  }

  next();
});

// Error handling
router.onError((error) => {
  console.error("Router error:", error);
});

export default router;