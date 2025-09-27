<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Humanitarian Aid
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connecting communities, providing hope, and making a difference in the lives of those who need it most.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/aid-requests"
              class="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Request Aid
            </router-link>
            <router-link
              to="/dashboard"
              class="btn-secondary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              View Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How We Help
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl ">
            Our platform streamlines the humanitarian aid process, making it easier to connect those in need with those who can help.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Aid</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Submit aid requests easily and track their status in real-time. Our system ensures your needs are heard and addressed promptly.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Coordinate Volunteers</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Join our network of dedicated volunteers and help distribute aid to those in need. Make a real difference in your community.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Track Progress</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Monitor the impact of humanitarian efforts with detailed analytics and reports. Transparency builds trust and improves outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-blue-600 dark:bg-blue-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">Our Impact</h2>
          <p class="text-xl text-blue-100">
            Together, we're making a difference in communities worldwide
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">1,247</div>
            <div class="text-blue-100">Beneficiaries Helped</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">89</div>
            <div class="text-blue-100">Active Requests</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">156</div>
            <div class="text-blue-100">Distributions Completed</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">45</div>
            <div class="text-blue-100">Volunteers Active</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Make a Difference?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Join our humanitarian aid platform today and be part of the solution.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </router-link>
          <router-link
            to="/aid-requests"
            class="btn-secondary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Learn More
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
})
</script>