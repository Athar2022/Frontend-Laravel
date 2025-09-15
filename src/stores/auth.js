import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials)
      const { user: userData, token: authToken } = response.data
      
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
      const response = await api.post('/register', userData)
      const { user: userData, token: authToken } = response.data
      
      user.value = userData
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
      await api.post('/logout')
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
      const response = await api.get('/user')
      user.value = response.data
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  }
})