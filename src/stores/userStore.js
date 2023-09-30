import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userToken: null,
    userData: {},
  }),

  getters: {
    getUserData: (state) => state.userData,
    getUserToken: (state) => state.userToken,
  },

  actions: {
    setUserToken(token) {
      this.token = token
    },
    removeUserToken() {
      this.token = null
    },
    setUserData(userData) {
      this.userData = userData
    },
  },
})
