<template>
  <div class="home-page">
    <div
      class="home-page__start-education row no-wrap q-mt-xl bg-white shadow-2 home-container"
    >
      <div class="home-page__start-education__description column q-my-xl">
        <div class="text-h4 text-bold q-mb-md">
          Учись и повышай свои навыки уже сейчас вместе с нами
        </div>
        <p class="q-mb-xl">
          Курсы обучения - ориентированные учебные пути, которые комплексно
          повышают ваши навыки работы
        </p>
        <div class="action">
          <router-link to="/catalog">
            <q-btn label="Начать обучение" color="primary" />
          </router-link>
        </div>
      </div>
      <div class="home-page__start-education__image">
        <q-img src="~assets/images/2.jpg" spinner-color="white" />
      </div>
    </div>
    <div
      v-if="recommendedCourses"
      class="home-page__recommendation bg-white shadow-2 home-container"
    >
      <div class="text-h6 text-bold q-mb-md">Рекомендации по профилю</div>
      <div v-if="recommendedCourseLoader" class="text-center">
        <q-spinner-oval color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]"></q-tooltip>
      </div>
      <carousel-component :courses="recommendedCourses" />
    </div>
    <div class="home-page__recommendation bg-white shadow-2 home-container">
      <div class="text-h6 text-bold q-mb-md">Популярные</div>
      <div v-if="popularCourseLoader" class="text-center">
        <q-spinner-oval color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]"></q-tooltip>
      </div>
      <carousel-component :courses="popularCourses" />
    </div>
  </div>
</template>

<script setup>
import CarouselComponent from 'src/components/CarouselComponent'

import { ref, onMounted } from 'vue'

import { getPopularCourses, getRecommendedCourses } from 'src/processes/courses'

// Recommended courses
const recommendedCourses = ref([])
const recommendedCourseLoader = ref(true)

// Popular courses
const popularCourses = ref([])
const popularCourseLoader = ref(true)

onMounted(() => {
  getPopularCourses().then((courses) => {
    popularCourseLoader.value = false
    popularCourses.value = courses
  })
  getRecommendedCourses().then((courses) => {
    recommendedCourseLoader.value = false
    recommendedCourses.value = courses
  })
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
