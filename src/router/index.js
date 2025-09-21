import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
  // {
  //   path: '/aid-requests/create',
  //   name: 'CreateAidRequest',
  //   component: () => import('@/views/CreateAidRequestView.vue'),
  //   meta: { requiresAuth: true, requiresBeneficiary: true }
  // },
  // {
  //   path: '/aid-requests/:id',
  //   name: 'AidRequestDetail',
  //   component: () => import('@/views/AidRequestDetailView.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/distributions',
  //   name: 'Distributions',
  //   component: () => import('@/views/DistributionsView.vue'),
  //   meta: { requiresAuth: true, requiresVolunteer: true }
  // },
  // {
  //   path: '/distributions/:id',
  //   name: 'DistributionDetail',
  //   component: () => import('@/views/DistributionDetailView.vue'),
  //   meta: { requiresAuth: true, requiresVolunteer: true }
  // },
  // {
  //   path: '/beneficiaries',
  //   name: 'Beneficiaries',
  //   component: () => import('@/views/BeneficiariesView.vue'),
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // },
  // {
  //   path: '/volunteers',
  //   name: 'Volunteers',
  //   component: () => import('@/views/VolunteersView.vue'),
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   component: () => import('@/views/ProfileView.vue'),
  //   meta: { requiresAuth: true }
  // },
 
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFoundView.vue')
  // }

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
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  console.log(`Navigating from ${from.name} to ${to.name}`);

  const authStore = useAuthStore();

  // إذا كانت الصفحة تتطلب مصادقة ولم يكن المستخدم معتمداً
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log("Redirecting to login: authentication required");
    next({ name: "Login", query: { redirect: to.fullPath } });
    return;
  }

  // إذا كانت الصفحة للضيوف فقط وكان المستخدم معتمداً
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    console.log("Redirecting to home: user is already authenticated");
    next({ name: "Home" });
    return;
  }

  // إذا كانت الصفحة تتطلب دور مشرف ولم يكن المستخدم مشرفاً
  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    console.log("Redirecting to home: admin role required");
    window.showToast(
      "error",
      "Access Denied",
      "You need admin privileges to access this page"
    );
    next({ name: "Home" });
    return;
  }

  // إذا كانت الصفحة تتطلب دور متطوع ولم يكن المستخدم متطوعاً أو مشرفاً
  if (
    to.meta.requiresVolunteer &&
    !["admin", "volunteer"].includes(authStore.user?.role)
  ) {
    console.log("Redirecting to home: volunteer role required");
    window.showToast(
      "error",
      "Access Denied",
      "You need volunteer privileges to access this page"
    );
    next({ name: "Home" });
    return;
  }

  // إذا كانت الصفحة تتطلب دور مستفيد ولم يكن المستخدم مستفيداً
  if (to.meta.requiresBeneficiary && authStore.user?.role !== "beneficiary") {
    console.log("Redirecting to home: beneficiary role required");
    window.showToast(
      "error",
      "Access Denied",
      "You need beneficiary privileges to access this page"
    );
    next({ name: "Home" });
    return;
  }

  console.log("Navigation allowed");
  next();
});

// مراقبة أخطاء التوجيه
router.onError((error) => {
  console.error("Router error:", error);
});

export default router;
