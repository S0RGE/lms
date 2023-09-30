<template>
  <div v-if="courses.length" style="width: 100%">
    <div ref="courseList">
      <courses-list :courses="paginatedCourses" />
    </div>
    <div class="q-pa-lg">
      <q-resize-observer @resize="onResize" />
      <div class="flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="maxCoursesPages"
          direction-links
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CoursesList from 'src/components/CoursesList'

const props = defineProps({
  courses: {
    type: Object,
    required: true,
  },
})

const onResize = () => {
  calculateMaxCourseListElements()
}

const maxCarouselElements = ref(9)

const maxCarouselSlides = computed(() => {
  if (!props.courses?.length) return
  const maxSlides = Math.ceil(props.courses.length / maxCarouselElements.value)
  return maxSlides
})

const currentPage = ref(1)

const paginatedCourses = computed(() => {
  if (props.courses.length > 0) {
    return props.courses.slice(
      currentPage.value * maxCarouselElements.value - maxCarouselElements.value,
      currentPage.value * maxCarouselElements.value
    )
  }

  return props.courses
})

const maxCoursesPages = computed(() => {
  if (props.courses.length < maxCarouselElements.value) return 1
  return Math.ceil(props.courses.length / maxCarouselElements.value)
})

const calculateMaxCourseListElements = () => {
  if (!props.courses) {
    return
  }
  if (maxCarouselSlides.value > 0) {
    maxCarouselElements.value =
      Math.floor((courseList.value?.clientWidth + 9) / carouselCardWidth) *
      MAX_COURSE_ROWS
  } else {
    maxCarouselElements.value =
      Math.floor((courseList.value?.clientWidth + 9) / carouselCardWidth) *
      MAX_COURSE_ROWS
  }
}

// course card width + gap
const carouselCardWidth = 300
const MAX_COURSE_ROWS = 2
const courseList = ref(null)

onMounted(() => {
  calculateMaxCourseListElements()
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
