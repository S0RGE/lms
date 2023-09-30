import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

import auth from 'src/helpers/auth/auth'

import { saveLogs, saveErrorLogs } from 'src/processes/logs'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    const userToken = (await auth.getToken()) ?? ''
    const userData = await auth.getUserData()

    localStorage.setItem('lms_token', userToken)
    localStorage.setItem('lms_user', JSON.stringify(userData))

    if (!userToken && to.name !== 'login') {
     
      localStorage.removeItem('lms_token')
      next({ name: 'login' })
      await saveErrorLogs(
        JSON.stringify({
          pageName: from.fullPath,
          eventName: `failed to move from ${from.fullPath} to ${to.fullPath}`,
          eventDate: new Date(),
          eventData: to.name,
          ticket: '00000000-0000-0000-0000-000000000000',
        })
      )
    } else {
      next()
      await saveLogs(
        JSON.stringify({
          pageName: from.fullPath,
          eventName:  `user moved from ${from.fullPath} to ${to.fullPath}`,
          eventDate: new Date(),
          eventData: to.name,
          ticket:
            userData[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
            ],
        })
      )
    }
  })

  return Router
})
