<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage all users in the system</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.role" class="input-field w-full md:w-auto">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
          <option value="beneficiary">Beneficiary</option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Search users..."
          class="input-field w-full md:w-64"
        />
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getRoleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.phone || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  Edit
                </button>
                <button 
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  :disabled="user.id === authUser.id"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || editingUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingUser ? 'Edit User' : 'Create New User' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="editingUser ? updateUser() : createUser()" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input v-model="userForm.name" type="text" required class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="userForm.email" type="email" required class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select v-model="userForm.role" required class="input-field">
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="volunteer">Volunteer</option>
              <option value="beneficiary">Beneficiary</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input v-model="userForm.phone" type="tel" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea v-model="userForm.address" rows="3" class="input-field"></textarea>
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input v-model="userForm.password" type="password" required class="input-field">
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input v-model="userForm.password_confirmation" type="password" required class="input-field">
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/authStore'

const userStore = useUserStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const editingUser = ref(null)
const loading = ref(false)

const filters = reactive({
  role: '',
  search: ''
})

const userForm = reactive({
  name: '',
  email: '',
  role: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: ''
})

const authUser = computed(() => authStore.user || {})
const users = computed(() => userStore.users)

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesRole = !filters.role || user.role === filters.role
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesRole && matchesSearch
  })
})

onMounted(async () => {
  await userStore.fetchUsers()
})

function getRoleClass(role) {
  const classes = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    volunteer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    beneficiary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function editUser(user) {
  editingUser.value = user
  Object.assign(userForm, {
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
    password: '',
    password_confirmation: ''
  })
}

function closeModal() {
  showCreateModal.value = false
  editingUser.value = null
  resetForm()
}

function resetForm() {
  Object.assign(userForm, {
    name: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  })
}

async function createUser() {
  loading.value = true
  try {
    await userStore.createUser(userForm)
    closeModal()
    window.showToast('success', 'Success', 'User created successfully')
  } catch (error) {
    console.error('Failed to create user:', error)
    window.showToast('error', 'Error', 'Failed to create user')
  } finally {
    loading.value = false
  }
}

async function updateUser() {
  loading.value = true
  try {
    await userStore.updateUser(editingUser.value.id, userForm)
    closeModal()
    window.showToast('success', 'Success', 'User updated successfully')
  } catch (error) {
    console.error('Failed to update user:', error)
    window.showToast('error', 'Error', 'Failed to update user')
  } finally {
    loading.value = false
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    await userStore.deleteUser(id)
    window.showToast('success', 'Success', 'User deleted successfully')
  } catch (error) {
    console.error('Failed to delete user:', error)
    window.showToast('error', 'Error', 'Failed to delete user')
  }
}
</script>