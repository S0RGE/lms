<template>
  <div class="flex justify-center items-center login-wrapper">
    <div class="login-wrapper__form">
      <div class="text-h4 text-center q-mb-xl">Вход</div>
      <q-form class="q-gutter-sm" @submit="handleSubmit">
        <small v-if="errorMessageDisplay" class="errorMessage">{{
          errorMessageDisplay
        }}</small>
        <q-input
          v-model.trim="login"
          label="Логин:"
          placeholder="Введите логин"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Поле Логин не может быть пустым',
          ]"
        />
        <q-input
          v-model.trim="password"
          label="Пароль:"
          placeholder="Введите пароль"
          :type="passwordVisible ? 'text' : 'password'"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Поле Пароль не может быть пустым',
          ]"
        >
          <template #append>
            <span
              :class="
                passwordVisible ? 'icon-visibility_off' : 'icon-visibility'
              "
              class="cursor-pointer"
              @click="passwordVisible = !passwordVisible"
            ></span>
          </template>
        </q-input>

        <div class="login-wrapper__form__actions row justify-center">
          <q-btn label="Войти" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, inject } from 'vue'

import { useUserStore } from 'src/stores/userStore'

import { saveLogs, saveErrorLogs } from 'src/processes/logs'

const auth = inject('auth')

const router = useRouter()

const userStore = useUserStore()

const passwordVisible = ref(false)
const errorMessageDisplay = ref('')

const login = ref('')
const password = ref('')

console.log('test: ', import.meta.env.VITE_APP_GRAPHQL_URL)

const handleSubmit = async () => {
  const { value: loginValue } = login
  const { value: passwordValue } = password

  const { success, errorMessage } = await auth.login(
    loginValue,
    passwordValue,
    true
  )

  if (success) {
    const token = await auth.getToken()
    const userData = await auth.getUserData()

    localStorage.setItem('lms_token', token)
    localStorage.setItem('lms_user', JSON.stringify(userData))

    userStore.setUserToken(token)
    userStore.setUserData(userData)

    const logData = JSON.stringify({
      pageName: 'loginPage',
      eventName: 'userLogin',
      eventDate: new Date(),
      eventData: 'User login successful',
      ticket:
        userData[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
        ],
    })

    saveLogs(logData)

    await router.push({ path: '/' })
  } else {
    const logData = {
      errorSource: 'Login page',
      errorName: 'User login failed',
      errorMessage: 'User login failed with login ' + loginValue,
      callsChain: '',
    }

    saveErrorLogs(logData)

    errorMessageDisplay.value = errorMessage
    setTimeout(() => {
      errorMessageDisplay.value = ''
    }, 5000)
  }
}
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
