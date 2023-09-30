const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.getItem('lms_token')) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('lms_token')) {
    next()
    return
  }
  next('/login')
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage'),
        meta: {
          breadCrumbs() {
            return [{ text: 'Профиль' }]
          },
        },
      },
      {
        path: 'catalog',
        name: 'catalog',
        component: () => import('pages/CatalogPage'),
        meta: {
          breadCrumbs() {
            return [{ text: 'Каталог курсов' }]
          },
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: '/lesson/:courseId',
        name: 'lesson',
        component: () => import('pages/LessonsPage'),
        beforeEnter: ifAuthenticated,
        props: {default: true, siderbar: false},
        meta: {
          breadCrumbs(route) {
            const courseName = route.query.courseName
            return [
              { text: 'Каталог курсов', to: { name: 'catalog' } },
              {
                text: courseName,
                to: {
                  name: 'course',
                  params: {
                    courseId: route.params.courseId,
                  },
                  query: {
                    courseName: courseName,
                  },
                },
              },
              { text: 'Уроки' },
            ]
          },
        },
      },
      {
        path: 'course/:courseId',
        name: 'course',
        props: true,
        meta: {
          breadCrumbs() {
            return [
              { text: 'Каталог курсов', to: { name: 'catalog' } },
            ]
          },
        },
        beforeEnter: ifAuthenticated,
        component: () => import('pages/CoursePage'),
      },
      {
        path: 'development',
        name: 'development',
        beforeEnter: ifAuthenticated,
        component: () => import('pages/InDevelopmentPage'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage'),
    beforeEnter: ifNotAuthenticated,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/HomePage'),
  },
]

export default routes
