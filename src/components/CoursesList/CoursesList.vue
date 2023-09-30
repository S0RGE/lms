<template>
  <div v-if="courses" ref="courseCarousel" class="courses-list ">
    <course-card
      v-for="course in props.courses"
      :key="course.id"
      :course="course"
    />
  </div>
</template>

<script setup>
import CourseCard from '../CourseCard'

const props = defineProps({
  courses: {
    type: Object,
    required: true,
  },
})

</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
