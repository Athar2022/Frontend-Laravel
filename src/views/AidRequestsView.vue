<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Aid Requests
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage aid requests from beneficiaries
        </p>
      </div>
      <button
        v-if="user.role === 'beneficiary'"
        @click="showCreateModal = true"
        class="btn-primary add-request-btn"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        New Request
      </button>
    </div>

    <!-- Filters -->
    <div class="card filters-card">
      <div class="flex flex-wrap gap-4 filters">
        <select v-model="filters.status" class="input-field w-full md:w-auto">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>

        <select v-model="filters.type" class="input-field w-full md:w-auto">
          <option value="">All Types</option>
          <option value="food">Food</option>
          <option value="clothing">Clothing</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Search requests..."
          class="input-field w-full md:w-64"
        />
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Beneficiary
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="request in filteredRequests" :key="request.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                    >
                      {{
                        request.beneficiary?.name?.charAt(0)?.toUpperCase() ||
                        "U"
                      }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ request.beneficiary?.name || "Unknown" }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ request.beneficiary?.email || "" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getTypeClass(request.type)"
                >
                  {{ request.type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div
                  class="text-sm text-gray-900 dark:text-white max-w-xs truncate"
                >
                  {{ request.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(request.status)"
                >
                  {{ request.status }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewRequest(request)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </button>
                <button
                  v-if="
                    ['admin', 'volunteer'].includes(user.role) &&
                    request.status === 'pending'
                  "
                  @click="updateRequestStatus(request.id, 'approved')"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  Approve
                </button>
                <button
                  v-if="
                    ['admin', 'volunteer'].includes(user.role) &&
                    request.status === 'pending'
                  "
                  @click="updateRequestStatus(request.id, 'denied')"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Deny
                </button>
              </td>
            </tr>

            <tr v-if="filteredRequests.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">
                <p class="text-gray-500 dark:text-gray-400">
                  No aid requests found
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Request Modal -->
    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Supporting Documents
      </label>
      <FileUpload
        ref="fileUpload"
        :multiple="true"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        :max-size="10"
        :max-files="5"
        @files-updated="handleFilesUpdate"
      />
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Upload ID documents or proof of need (Max 5 files, 10MB each)
      </p>
    </div>
    <CreateRequestModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleRequestCreated"
    />

    <!-- View Request Modal -->
    <ViewRequestModal
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
      @updated="handleRequestUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useAidRequestStore } from "@/stores/aidRequest";
import CreateRequestModal from "@/components/requests/CreateRequestModal.vue";
import ViewRequestModal from "@/components/requests/ViewRequestModal.vue";
import FileUpload from "@/components/ui/FileUpload.vue";

const authStore = useAuthStore();
const aidRequestStore = useAidRequestStore();
const selectedRequest = ref(null);
const showCreateModal = ref(false);
const loading = ref(false);
const uploadedFiles = ref([]);

const filters = reactive({
  status: "",
  type: "",
  search: "",
  page: 1,
  per_page: 10
});

const user = computed(() => authStore.user || {});
const requests = computed(() => aidRequestStore.requests);
const pagination = computed(() => aidRequestStore.pagination);

const filteredRequests = computed(() => {
  return requests.value.filter((request) => {
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesType = !filters.type || request.type === filters.type;
    const matchesSearch = !filters.search || 
      request.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      (request.beneficiary_name && request.beneficiary_name.toLowerCase().includes(filters.search.toLowerCase()));

    return matchesStatus && matchesType && matchesSearch;
  });
});

onMounted(() => {
  fetchRequests();
});

watch(
  () => ({ ...filters }),
  () => {
    filters.page = 1; // Reset to first page when filters change
    fetchRequests();
  },
  { deep: true }
);

async function fetchRequests() {
  try {
    await aidRequestStore.fetchRequests(filters);
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    window.showToast("error", "Error", "Failed to load aid requests");
  }
}

function getStatusClass(status) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    denied: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };
  return classes[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

function getTypeClass(type) {
  const classes = {
    food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    clothing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    medical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    shelter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };
  return classes[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function viewRequest(request) {
  selectedRequest.value = request;
}

async function updateRequestStatus(requestId, status) {
  try {
    await aidRequestStore.updateRequestStatus(requestId, status);
    window.showToast("success", "Success", `Request ${status} successfully`);
    fetchRequests();
  } catch (error) {
    console.error("Failed to update request:", error);
    window.showToast("error", "Error", "Failed to update request status");
  }
}

function handleRequestCreated() {
  showCreateModal.value = false;
  fetchRequests();
  window.showToast("success", "Success", "Aid request created successfully");
}

function handleRequestUpdated() {
  selectedRequest.value = null;
  fetchRequests();
}

function handleFilesUpdate(files) {
  uploadedFiles.value = files;
}

function handleFileUpload(event) {
  const files = event.target.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      window.showToast('error', 'File too large', `${file.name} exceeds 5MB limit`);
      continue;
    }
    uploadedFiles.value.push(file);
  }
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1);
}

async function submitRequest(requestData) {
  loading.value = true;

  try {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(requestData).forEach(key => {
      if (requestData[key] !== null && requestData[key] !== undefined) {
        formData.append(key, requestData[key]);
      }
    });

    // Add uploaded files
    uploadedFiles.value.forEach(file => {
      formData.append('documents[]', file);
    });

    await aidRequestStore.createRequest(formData);
    
    // Reset form and files
    uploadedFiles.value = [];
    showCreateModal.value = false;
    
    window.showToast('success', 'Success', 'Aid request created successfully');
    fetchRequests();
  } catch (error) {
    console.error('Failed to create aid request:', error);
    const message = error.response?.data?.message || 'Failed to create aid request';
    window.showToast('error', 'Error', message);
  } finally {
    loading.value = false;
  }
}

function nextPage() {
  if (pagination.value.current_page < pagination.value.last_page) {
    filters.page++;
    fetchRequests();
  }
}

function prevPage() {
  if (pagination.value.current_page > 1) {
    filters.page--;
    fetchRequests();
  }
}
</script>

<style scoped>
/* Add clear separation between filters and requests list */
.filters-card {
  margin-bottom: 1.5rem; /* 24px */
}

/* Add Request button: slightly larger, calm spacing */
.add-request-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Filters: enforce black text inside input/select as requested */
.filters select,
.filters input[type="text"] {
  color: #111827; /* text-gray-900 */
}

.filters select::placeholder,
.filters input[type="text"]::placeholder {
  color: #111827; /* ensure placeholder appears black as well */
  opacity: 0.7;
}

/* On dark mode keep text readable but prefer neutral black-ish look as requested */
.dark .filters select,
.dark .filters input[type="text"] {
  color: #e5e7eb; /* text-gray-200 for dark to ensure contrast */
}

.dark .filters select::placeholder,
.dark .filters input[type="text"]::placeholder {
  color: #e5e7eb;
  opacity: 0.8;
}
</style>