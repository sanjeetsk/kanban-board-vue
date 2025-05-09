// stores/useAuthStore.js
import { defineStore } from 'pinia'
import API from '../Axios/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    signupSuccess: false,
    userCount: 0,
  }),
  actions: {
    async fetchCurrentUser() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.user = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching user'
      } finally {
        this.loading = false
      }
    },

    async fetchUserCount() {
      const response = await API.get('/auth/count')
      this.userCount = response.data.totalUsers
    },

    async loginUser(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await API.post('/auth/login', credentials)
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },

    async signupUser(credentials) {
      this.loading = true
      this.error = null
      this.signupSuccess = false
      try {
        await API.post('/auth/signup', credentials)
        this.signupSuccess = true
      } catch (error) {
        this.error = error.response?.data?.message || 'Signup failed'
        this.signupSuccess = false
      } finally {
        this.loading = false
      }
    },

    logoutUser() {
      this.user = null
      this.token = null
      this.signupSuccess = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
