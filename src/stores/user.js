import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await userService.getAll()
      users.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await userService.getById(id)
      currentUser.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch user'
      console.error('Error fetching user:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const data = await userService.create(userData)
      users.value.push(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create user'
      console.error('Error creating user:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    loading.value = true
    error.value = null
    try {
      const data = await userService.update(id, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = data
      }
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update user'
      console.error('Error updating user:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    error.value = null
    try {
      await userService.delete(id)
      users.value = users.value.filter(user => user.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete user'
      console.error('Error deleting user:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const getUsersByRole = async (role) => {
    loading.value = true
    error.value = null
    try {
      const data = await userService.getByRole(role)
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users by role'
      console.error('Error fetching users by role:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole
  }
})