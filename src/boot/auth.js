import { boot } from 'quasar/wrappers'
import auth from '@it-enterprise/jwtauthentication'
// import

export default boot(
  /* async */ ({ app, router }) => {
    auth.config({
      baseUrl: import.meta.env.VITE_APP_BASE_URL,
      onError: () => {
        auth.clearTokens()
        clearLocalStorageTokens()
        router.push({
          name: 'login',
        })
      },
    })

    app.provide('auth', auth)
  }
)

const clearLocalStorageTokens = () => {
  localStorage.removeItem('lms_user')
  localStorage.removeItem('lms_roken')
}
