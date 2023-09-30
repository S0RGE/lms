import auth from '@it-enterprise/jwtauthentication'

// import { useUserStore } from 'src/stores/userStore'
// const userStore = useUserStore()

auth.config({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  onError: () => {
    auth.clearTokens()
  },
})

export default auth
