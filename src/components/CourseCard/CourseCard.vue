<template>
  <q-card v-if="course" bordered class="course-card">
    <q-img
      src="~assets/images/3.jpg"
      spinner-color="white"
      style="cursor: pointer"
      @click="pickCourse"
    />

    <q-card-section>
      <div
        class="text-weight-bold course-card__title"
        :title="course.name"
        @click="pickCourse"
      >
        {{ course.name }}
      </div>
      <div class="row justify-between items-center">
        <q-btn
          :label="continueButtonName"
          size="1em"
          no-caps
          unelevated
          :disable="course.status === 'UNAVAILABLE'"
          dense
          @click="moveToLesson"
        />
        <span
          :class="course.isFavorite ? 'icon-bookmark' : 'icon-bookmark_border'"
          style="font-size: 1.5em"
          @click="toggleCourseFavourite"
        ></span>
      </div>
      <div>
        {{ courseDuration }}
      </div>
    </q-card-section>

    <!-- <q-card-section class="q-pt-none">{{ courseDuration }} </q-card-section> -->

    <q-card-section v-if="course.roles" class="q-py-none card-chips">
      <q-chip
        v-for="role in course.roles"
        :key="role.name"
        color="grey-4"
        text-color="grey-9"
        dense
        class="card-chip"
      >
        {{ role.name }}
      </q-chip>
      <q-chip
        v-for="level in course.levels"
        :key="level.name"
        color="grey-4"
        text-color="grey-9"
        dense
        class="card-chip"
      >
        {{ level.name }}
      </q-chip>
      <q-chip
        :key="course.category.name"
        color="grey-4"
        dense
        text-color="grey-9"
        class="card-chip"
      >
        {{ course.category.name }}
      </q-chip>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { fixStartCourse } from 'src/processes/courses'

import getLastPassedCourseLessonId from 'src/helpers/composables/getLastPassedCourseLessonId.js'

// import {
//   addCourseToFavourites,
//   removeCourseFromFavourites,
// } from 'src/processes/courses'

const router = useRouter()

const props = defineProps({
  course: { type: Object, required: true },
})

const moveToLesson = async () => {
  if (props.course.status === 'STARTED') {
    const lastLessonId = await getLastPassedCourseLessonId(
      props.course.courseGuid
    )
    router.push({
      name: 'lesson',
      params: {
        courseId: props.course.courseGuid,
      },
      query: {
        lessonId: lastLessonId,
      },
    })
  } else {
    await fixStartCourse(props.course.courseGuid)

    router.push({
      name: 'lesson',
      params: {
        courseId: props.course.courseGuid,
      },
    })
  }
}

const toggleCourseFavourite = () => {
  if (props.course.isFavorite) {
    // removeCourseFromFavourites(props.course.courseGuid)
  } else {
    // addCourseToFavourites(props.course.courseGuid)
  }
}

const courseDuration = computed(() => {
  if (!props.course) return '0 мин.'
  if (props.course.durationMinutes < 60)
    return `${props.course.durationMinutes} мин.`

  return `${Math.floor(props.course.durationMinutes / 60)} ч. ${
    props.course.durationMinutes % 60
  } мин.`
})

const continueButtonName = computed(() => {
  return props.course.status === 'STARTED' ? 'Продолжить' : 'Начать'
})

const pickCourse = () => {
  router.push({
    name: 'course',
    params: {
      courseId: props.course.courseGuid,
    },
  })
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
