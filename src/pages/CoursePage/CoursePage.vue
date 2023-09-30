<template>
  <div class="course-bg">
    <div v-if="currentCourse" class="course-wrapper course-container">
      <div class="course-wrapper__header shadow-2 q-mb-xl bg-white q-mt-sm">
        <bread-crumbs-component :crumbs="crumbs" />
        <div class="text-h3 header text-weight-bold q-my-xl text-center">
          {{ currentCourse.name }}
        </div>
        <q-tabs v-model="courseData" class="course-tabs">
          <q-tab name="about" label="О курсе" @click="navigateTo(about)" />
          <q-tab
            name="program"
            label="Программа курса"
            @click="navigateTo(program)"
          />
          <!-- <q-tab name="reviews" label="Отзывы" @click="navigateTo(rating)" /> -->
        </q-tabs>
      </div>
      <div ref="about">
        <course-about
          :course-about-data="courseAboutData"
          :course-progress="courseProgress"
          @add-to-favourite="onAddToFavourite"
          @move-to-lessons="moveToLessons"
        />
      </div>
      <div ref="program">
        <course-program :course-program-data="courseProgramData" />
      </div>
      <!-- <div ref="rating">
        <course-review :rating-info="currentCourse.ratingInfo" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

import CourseAbout from './components/CourseAbout'
import CourseProgram from './components/CourseProgram'
// import CourseReview from './components/CourseReview'
import BreadCrumbsComponent from 'src/components/BreadCrumbsComponent'

import getLastPassedCourseLessonId from 'src/helpers/composables/getLastPassedCourseLessonId.js'

import {
  getCourseDetails,
  fixStartCourse,
  addCourseToFavourites,
  removeCourseFromFavourites,
} from 'src/processes/courses'

const $q = useQuasar()

const route = useRoute()
const router = useRouter()

// Course
const currentCourse = ref({})
const courseProgramData = ref([])
const courseDetails = ref([])
const courseAboutData = ref({})
// const courseProgress = ref(0)

const courseData = ref('about')

const getCourseAboutData = (details) => {
  if (!details.levels) return null

  return {
    description: details.description,
    durationMinutes: details.durationMinutes,
    levels: [...details.levels, ...details.roles],
    status: details.status,
    courseGoals: details.coursGoals,
    isFavorite: details.isFavorite,
    lessonsQuantity: details.lessonsQty,
    exitSkills: details.exitSkills,
    exitKnowledge: details.exitKnowledge,
  }
}

// Inner navigation
const about = ref(null)
const program = ref(null)

const navigateTo = (target) => {
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  })
}

const onAddToFavourite = async () => {
  if (currentCourse.value.isFavorite) {
    const result = await removeCourseFromFavourites(route.params.courseId)
    if (result) {
      $q.notify({
        message: 'Курс удален из избранного',
      })
      fetchCourseDetails()
    }
  } else {
    const result = await addCourseToFavourites(route.params.courseId)
    if (result) {
      $q.notify({
        message: 'Курс добавлен в избранное',
      })
      fetchCourseDetails()
    }
  }
}

const moveToLessons = async () => {
  if (currentCourse.value.status === 'UNAVAILABLE') {
    $q.notify({
      message: 'В данный момент курс недоступен',
    })
    return
  }

  if (currentCourse.value.status === 'STARTED') {
    const lastLessonId = await getLastPassedCourseLessonId(
      currentCourse.value.courseGuid
    )
    router.push({
      name: 'lesson',
      params: {
        courseId: currentCourse.value.courseGuid,
      },
      query: {
        lessonId: lastLessonId,
      },
    })
  } else {
    await fixStartCourse(currentCourse.value.courseGuid)
    router.push({
      name: 'lesson',
      params: {
        courseId: currentCourse.value.courseGuid,
      },
    })
  }
}

// const onAddReview = async (rating) => {
//   const type = JSON.parse(localStorage.getItem('lms_user'))[
//     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
//   ]

//   await addCoursereview(
//     defaultApolloClient,
//     route.params.courseId,
//     type,
//     rating
//   )
// }

const fetchCourseDetails = () => {
  getCourseDetails(route.params.courseId).then((details) => {
    courseDetails.value = details
    currentCourse.value = details?.course
    courseProgramData.value = details?.modules
    courseAboutData.value = getCourseAboutData(details?.course)
  })
}

const courseProgress = computed(() => {
  let passedLessonsCount = 0
  let allLessonsCount = 0
  courseProgramData.value?.map((module) => {
    passedLessonsCount += module.units.filter((lesson) => lesson.passed).length
    allLessonsCount += module.units.length
  })

  if (passedLessonsCount === 0 || allLessonsCount === 0) {
    return 0
  }

  return Number((passedLessonsCount / allLessonsCount).toFixed(2))
})

// Bread crumbs
const crumbs = computed(() => [
  {
    name: 'Каталог курсов',
    to: '/catalog',
  },
  {
    name: currentCourse.value?.name,
  },
])

onMounted(() => {
  fetchCourseDetails()
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
