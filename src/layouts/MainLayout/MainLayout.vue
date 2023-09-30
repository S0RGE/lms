<template>
  <q-layout
    class="main-layout"
    view="hHh Lpr lff"
  >
    <q-header
      elevated
      class="header bg-white"
    >
      <q-toolbar class="bg-white text-black app-container main-layout__menu">
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="openMenu"
        >
          <q-drawer
            v-model="isMenuOpen"
            overlay
            :width="200"
            :breakpoint="700"
            elevated
          >
            <q-scroll-area class="fit aside-menu">
              <div class="q-pa-sm">
                <q-list style="min-width: 100px">
                  <q-item
                    v-for="menuRef in menuRefs"
                    :key="menuRef.label"
                    v-close-popup
                    class="ref-item"
                    clickable
                    @click="openMenu"
                  >
                    <q-item-section class="row text-left">
                      <router-link
                        class="main-menu__item"
                        :to="menuRef.anchor"
                      >
                        <span
                          style="font-size: 1.3em"
                          color="primary"
                          class="q-mr-md"
                          :class="'icon-' + menuRef.icon"
                        ></span>
                        {{ menuRef.label }}</router-link>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-scroll-area>
          </q-drawer>
        </q-btn>
        <q-toolbar-title class="text-center text-primary header-main-text text-italic text-weight-bolder">lms &#183;
          learning</q-toolbar-title>
        <q-btn
          v-if="isLoggedIn"
          flat
          icon="account_circle"
          :label="userName"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-close-popup
                clickable
              >
                <q-item-section avatar>
                  <span
                    class="icon-account_circle"
                    style="font-size: 1.5em"
                  >
                  </span>
                </q-item-section>
                <q-item-section class="q-pa-sm">
                  <router-link to="/profile">
                    Профиль</router-link></q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="userLogout"
              >
                <q-item-section avatar>
                  <span
                    class="icon-logout"
                    style="font-size: 1.5em"
                  ></span>
                </q-item-section>
                <q-item-section class="q-pa-sm"> Выйти</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          v-else
          flat
          label="Войти"
          @click="userLogin"
        >
          <span class="icon-login"></span>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container
      class="app-container"
      style="padding-top: 0; padding-bottom: 0"
    >
      <router-view></router-view>
    </q-page-container>
    <q-footer
      elevated
      class="footer bg-white text-black q-py-sm"
    >
      <div class="text-center column">
        <b><a
            href="https://github.com/S0RGE"
            class="text-uppercase"
            color="primary"
            target="_blank"
          >S0RGE</a></b>
        <div>&copy;{{ new Date().getFullYear() }} Все права защищены</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onUnmounted, ref, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

import { useMutation } from '@vue/apollo-composable'

import { SAVE_LOG } from 'src/helpers/graphql/mutation/logs'

const userStore = useUserStore()

const auth = inject('auth')

let logData = null

const { mutate: saveLogData } = useMutation(SAVE_LOG, {
  variables: { logData: logData },
})

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('lms_token')
})

const userName = ref('')

onMounted(() => {
  if (localStorage.getItem('lms_user')) {
    userName.value = JSON.parse(localStorage.getItem('lms_user')).userName
  }
})

const router = useRouter()

const userLogout = async () => {
  if (localStorage.getItem('lms_user')) {
    logData = JSON.stringify({
      pageName: 'logoutPage',
      eventName: 'userLogout',
      eventDate: new Date(),
      eventData: 'User logout successful',
      ticket: JSON.parse(localStorage.getItem('lms_user'))[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
      ],
    })

    await saveLogData({
      logData: logData,
    })
  }

  auth.clearTokens()
  localStorage.removeItem('lms_token')
  localStorage.removeItem('lms_user')
  userStore.removeUserToken()

  await router.push('/login')
}

// Menu
const isMenuOpen = ref(false)
const menuRefs = ref([
  { label: 'Learning', anchor: '/catalog', icon: 'school' },
  { label: 'Wiki', anchor: '/development', icon: 'travel_explore' },
  { label: 'Support', anchor: '/development', icon: 'question_mark' },
])

const openMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const userLogin = () => {
  router.push({ path: '/login' })
}

onUnmounted(() => {
  localStorage.removeItem('lms_token')
  localStorage.removeItem('lms_user')
})
</script>

<style lang="scss" scooped>@use './styles.scss';</style>
