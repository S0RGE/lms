<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="courseAboutData"
    id="course-about"
    class="course-about shadow-2 q-px-md q-py-md bg-white"
  >
    <div class="course-about__title header text-h4 text-uppercase">О курсе</div>
    <div class="course-about-description row no-wrap">
      <div style="flex-grow: 2">
        {{ courseAboutData.description }}
      </div>
      <div
        class="course-about__description__actions row reverse no-wrap q-ml-sm"
      >
        <span
          title="Добавить в избранное"
          style="font-size: 2em"
          class="about-bookmark"
          :class="
            courseAboutData?.isFavorite
              ? 'icon-bookmark'
              : 'icon-bookmark_border'
          "
          @click="addToFavourite"
        ></span>

        <div>
          <q-btn
            color="grey-1"
            text-color="black"
            outline
            @click="moveToLesson"
          >
            <span
              class="icon-play_circle_outline"
              style="font-size: 1.5em; margin-right: 0.5em"
            ></span>
            <span>{{ continueButtonName }}</span>
            <!-- <router-link
              :to="{ name: 'lesson', params: { lessonId: courseAboutData.id } }"
            >
              {{ continueButtonName }}
            </router-link> -->
          </q-btn>
        </div>
      </div>
    </div>

    <div class="course-about__img column items-center">
      <div class="img-tags row items-start">
        <q-chip
          v-for="level in courseAboutData.levels"
          :key="level.code"
          square
          color="grey-3"
          >{{ level.name }}</q-chip
        >
      </div>
      <img src="~assets/images/1.jpg" alt="" class="course-about__image" />
    </div>

    <div class="course-about__info row justify-center">
      <div class="course-about__info__block">
        <span
          class="icon-access_time"
          style="font-size: 0.7em; color: #1a234b"
        ></span>
        <div class="time">
          {{ courseDuration.hours }}<span>Час</span>{{ courseDuration.minutes
          }}<span>мин</span>
        </div>
      </div>
      <q-separator vertical />
      <div class="course-about__info__block">
        <span
          class="icon-play_lesson"
          style="font-size: 0.7em; color: #1a234b"
        ></span>
        <div class="time">
          {{ courseAboutData.lessonsQuantity
          }}<span>{{ lessonsQuantityText }}</span>
        </div>
      </div>
    </div>
    <div class="course-about__progress">
      <div>{{ courseProgress * 100 }} %</div>
      <q-linear-progress size="10px" :value="courseProgress" class="q-mt-md" />
    </div>
    <div class="course-about__knowledges">
      <div v-if="courseAboutData.exitKnowledge">
        <div class="text-h5 header">Что вы будете знать?</div>
        <div v-html="courseAboutData.exitKnowledge"></div>
      </div>
      <div v-if="courseAboutData.exitSkills">
        <div class="text-h5 header">Что вы будете уметь?</div>

        <div v-html="courseAboutData.exitSkills"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  courseAboutData: {
    type: Object,
    required: false,
    default: null,
  },
  courseProgress: {
    type: Number,
    required: false,
    default: 0,
  },
})

const emit = defineEmits(['add-to-favourite', 'move-to-lessons'])

const addToFavourite = () => {
  emit('add-to-favourite')
}

const moveToLesson = () => {
  emit('move-to-lessons')
}

const continueButtonName = computed(() => {
  return props.courseAboutData.status === 'STARTED' ? 'Продолжить' : 'Начать'
})

const courseDuration = computed(() => {
  return {
    hours: Math.floor(props.courseAboutData.durationMinutes / 60),
    minutes: props.courseAboutData.durationMinutes % 60,
  }
})

const lessonsQuantityText = computed(() => {
  if (props.courseAboutData.lessonsQuantity % 10 === 1) return 'Урок'
  if (
    props.courseAboutData.lessonsQuantity % 10 > 1 &&
    props.courseAboutData.lessonsQuantity % 10 < 5
  )
    return 'Урока'
  return 'Уроков'
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
