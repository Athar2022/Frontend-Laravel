import { defineStore } from 'pinia'
import axios from '@/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  actions: {
    async login(form) {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.post('/api/login', {
          email: form.email,
          password: form.password
        })

        this.user = response.data.user
        this.token = response.data.token
        this.isAuthenticated = true

        // حفظ البيانات في localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)

        // إضافة التوكن لكل الطلبات القادمة
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        console.error('Login error details:', error.response?.data || error.message)
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed'
        }
      }
    },

    async register(form) {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.post('/api/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
          phone: form.phone || null,
          address: form.address || null
        })

        this.user = response.data.user
        this.token = response.data.token
        this.isAuthenticated = true

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        console.error('Register error:', error.response?.data)
        return {
          success: false,
          message: error.response?.data?.message || 'Registration failed',
          errors: error.response?.data?.errors || null
        }
      }
    },

    async logout() {
      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false

        localStorage.removeItem('user')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/user')
        this.user = response.data
        this.isAuthenticated = true
      } catch {
        this.isAuthenticated = false
      }
    },

    // استرجاع البيانات من localStorage عند تحميل الصفحة
    initializeFromStorage() {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser)
        this.token = savedToken
        this.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    }
  }
})
