<template>
  <div class="profile-wrapper column">
    <div class="q-mt-sm q-mx-lg">
      <bread-crumbs-component :crumbs="crumbs" />
    </div>
    <div class="column justify-center align-center">
      <div class="profile-wrapper__header text-h3 text-center q-mb-lg">
        Профиль пользователя
      </div>
      <div class="profile-wrapper__content">
        <q-card class="row justify-center profile-card bg-white">
          <q-card-section class="profile-wrapper__content__main card-border">
            <div class="text-h4 q-mb-md text-center">
              {{ userData.userName || 'Фамилия И.О.' }}
            </div>
            <q-separator class="q-mb-lg" />
            <div class="text-profile row justify-center">
              <q-btn
                color="white"
                text-color="black"
                class="profile-btn q-mb-sm"
                label="Персональные данные"
                @click="selectedInfo = 'profile'"
              />
              <q-btn
                color="white"
                text-color="black"
                class="profile-btn q-mb-sm"
                label="Начатые курсы"
                @click="selectedInfo = 'startedCourses'"
              />
              <q-btn
                color="white"
                text-color="black"
                class="profile-btn q-mb-sm"
                label="Пройденные курсы"
                @click="selectedInfo = 'finishedCourses'"
              />
            </div>
          </q-card-section>
          <q-card-section
            v-if="selectedInfo === 'profile'"
            class="profile-wrapper__content__data card-border"
          >
            <div class="text-h4 q-mb-md text-center">Персональные данные</div>
            <q-separator class="q-mb-lg" />
            <div class="row">
              <div>
                <div class="user-info">
                  <div class="text-profile q-mb-sm">Фамилия:</div>
                  <div class="text-profile q-mb-sm">Имя:</div>
                  <div class="text-profile q-mb-sm">Отчество:</div>
                  <!-- <div class="text-profile q-mb-lg">email:</div> -->
                </div>
              </div>
              <div>
                <div class="user-info">
                  <div class="text-profile q-mb-sm">
                    {{ userName[0] || 'Фамилия недоступна' }}
                  </div>
                  <div class="text-profile q-mb-sm">
                    {{ userName[1] || 'Имя недоступно' }}
                  </div>
                  <div class="text-profile q-mb-sm">
                    {{ userName[2] || 'Отчество недоступно' }}
                  </div>
                  <!-- <div class="text-profile q-mb-lg">
                    {{ userName || 'Email недоступен' }}
                  </div> -->
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            v-if="selectedInfo === 'startedCourses'"
            class="profile-wrapper__content__data card-border"
          >
            <div class="text-h4 q-mb-md text-center">Начатые курсы</div>
            <q-separator class="q-mb-lg" />

            <q-list bordered separator style="width: 100%">
              <q-item
                v-for="course in startedCourses"
                :key="course.courseGuid"
                v-ripple
                style="width: 100%"
                clickable
                @click="moveToLesson(course.courseGuid)"
              >
                <q-item-section>{{ course.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section
            v-if="selectedInfo === 'finishedCourses'"
            class="profile-wrapper__content__data card-border"
          >
            <div class="text-h4 q-mb-md text-center">Пройденные курсы</div>
            <q-separator class="q-mb-lg" />
            <q-list bordered separator style="width: 100%">
              <q-item
                v-for="course in completedCourses"
                :key="course.courseGuid"
                v-ripple
                style="width: 100%"
                clickable
                @click="moveToLesson(course.courseGuid)"
              >
                <q-item-section>{{ course.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, inject } from 'vue'
import { useRouter } from 'vue-router'

import { getCompletedCourses, getStartedCourses } from 'src/processes/courses'

const auth = inject('auth')

const router = useRouter()

import BreadCrumbsComponent from 'src/components/BreadCrumbsComponent'

const userData = ref({})

const completedCourses = ref([])
const startedCourses = ref([])

const selectedInfo = ref('profile')

const crumbs = ref([
  {
    name: 'Профиль',
  },
])

const userName = computed(() => {
  if (userData.value.userName) return userData.value.userName.split(' ')
  return ['Фамилия недоступна', 'Имя недоступно', 'Отчество недоступно']
})

const moveToLesson = (courseId) => {
  router.push({
    name: 'lesson',
    params: {
      courseId,
    },
  })
}

onMounted(() => {
  userData.value = auth.getUserData()
  getCompletedCourses().then((courses) => {
    completedCourses.value = courses
  })
  getStartedCourses().then((courses) => {
    startedCourses.value = courses
  })
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
