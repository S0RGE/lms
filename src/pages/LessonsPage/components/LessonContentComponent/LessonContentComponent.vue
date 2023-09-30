<template>
  <div class="lesson-content_wrapper">
    <text-component
      v-if="
        selectedLessonType === 'TEXT' ||
        selectedLessonType === 'PRESENTATION' ||
        selectedLessonType === 'FILE'
      "
      :key="key"
      :lesson-material="selectedLessonLink"
    />
    <video-component
      v-if="selectedLessonType === 'VIDEO'"
      :key="key"
      :video-url="selectedLessonLink"
      @fix-lesson-passing="onFixLessonPassing"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import VideoComponent from './components/VideoComponent'
import TextComponent from './components/TextComponent'

const props = defineProps({
  selectedLessonType: {
    type: String,
    required: true,
  },
  selectedLessonLink: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['fix-lesson-passing'])

const onFixLessonPassing = () => {

  emits('fix-lesson-passing')
  
}

const key = computed(() => props.selectedLessonLink + props.selectedLessonType)
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
