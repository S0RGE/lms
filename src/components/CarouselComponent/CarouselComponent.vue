<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div v-if="courses?.length" class="q-pa-md">
    <q-resize-observer @resize="onResize" />
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      padding
      arrows
      height="350px"
      class="rounded-borders"
    >
      <q-carousel-slide
        v-for="(slide, index) in maxCarouselSlides"
        :key="index"
        :name="index + 1"
        class="column no-wrap"
      >
        <div
          ref="courseCarousel"
          class="row fit justify-center items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <div class="course-cards row no-wrap" style="max-width: 100%">
            <course-card
              v-for="course in sliceCarousel(index)"
              :key="course.id"
              :course="course"
              style="max-width: 280px; max-height: 350px; flex-shrink: 1"
            />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CourseCard from '../CourseCard'

const props = defineProps({
  courses: {
    type: Array,
    required: true,
  },
})

const courseCarousel = ref(null)

const onResize = () => {
  calculateMaxCarouselElements()
}

const slide = ref(1)
const maxCarouselElements = ref(4)
const carouselCardWidth = 278

const maxCarouselSlides = computed(() => {
  if (!props.courses?.length) return
  const maxSlides = Math.ceil(props.courses.length / maxCarouselElements.value)
  return maxSlides
})

const calculateMaxCarouselElements = () => {
  if (!courseCarousel.value) {
    return
  }
  if (maxCarouselSlides.value > 0) {
    maxCarouselElements.value = Math.floor(
      courseCarousel.value[0]?.clientWidth / carouselCardWidth
    )
  } else {
    maxCarouselElements.value = Math.floor(
      courseCarousel.value?.clientWidth / carouselCardWidth
    )
  }
}

const sliceCarousel = (index) => {
  const firstIndex = index * maxCarouselElements.value
  const lastIndex = (index + 1) * maxCarouselElements.value
  const sliceCarouselElements = props.courses?.slice(firstIndex, lastIndex)
  return sliceCarouselElements
}

onMounted(() => {
  calculateMaxCarouselElements()
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
