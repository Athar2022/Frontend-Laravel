import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)
  const users = ref([])
  const loading = ref(false)

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const { user: userData, token: authToken } = response
      
      user.value = userData
      token.value = authToken
      localStorage.setItem('token', authToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { user: newUser, token: authToken } = response
      
      user.value = newUser
      token.value = authToken
      localStorage.setItem('token', authToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    try {
      const userData = await authService.getUser()
      user.value = userData
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getAll()
      users.value = usersData
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  const createUser = async (userData) => {
    try {
      const newUser = await userService.create(userData)
      users.value.push(newUser)
      return newUser
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const deleteUser = async (id) => {
    try {
      await userService.delete(id)
      users.value = users.value.filter(u => u.id !== id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    users,
    loading,
    login,
    register,
    logout,
    fetchUser,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})