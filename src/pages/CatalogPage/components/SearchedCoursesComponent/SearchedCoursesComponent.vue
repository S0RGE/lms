<template>
  <div class="courses-wrapper" :class="{ 'max-width': $q.screen.lt.lg }">
    <div v-if="courses.length" class="courses-list">
      <module-card
        v-for="course in props.courses"
        :key="course.id"
        :course="course"
        class="q-mb-sm"
      />
    </div>
    <div v-else>
      <div class="text-h4 text-center">По вашему запросу ничего не найдено</div>
    </div>
  </div>
</template>

<script setup>
import ModuleCard from './components/ModuleCard'
import { useQuasar } from 'quasar'
const props = defineProps({
  courses: {
    type: Array,
    required: true,
  },
})

const $q = useQuasar()
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
