<template>
  <div class="lesson-list q-pa-md" style="max-width: 400px">
    <div class="lesson-list__header row justify-between q-mb-sm">
      <div class="text-h6">Уроки</div>
      <div class="row items-center">
        <span
          :class="isFavouriteCourse ? 'icon-bookmark' : 'icon-bookmark_border'"
          class="q-mr-sm row items-center"
          style="font-size: 1.3em; cursor: pointer"
          @click="addToFavourites"
        ></span>
        <div
          class="lesson-list__header__complete q-mr-sm row items-center justify-center"
        >
          {{ Math.round(lessonProgress * 100) }} %
        </div>
        <div class="row items-center">
          {{ moduleProgress }}/ {{ lessons.length }}
        </div>
      </div>
    </div>
    <q-virtual-scroll
      v-slot="{ item, index }"
      style="max-height: 80vh; border: 1px solid #1a234b0e; border-radius: 5px"
      :items="lessons"
      separator
    >
      <q-expansion-item
        :key="item.name"
        :icon="checkLessonPass(item) ? 'check_circle' : 'adjust'"
        :label="item.name"
        :default-opened="selectedModule === index"
        :caption="`${item.durationMinutes}мин. ${getPassedLessons(item)}/${
          item.units.length
        }`"
        :header-class="checkLessonPass(item) ? 'text-green-5' : 'text-black-5'"
        expand-icon-toggle
      >
        <q-separator />
        <q-list separator>
          <q-item
            v-for="unit in item.units"
            :key="unit.name"
            v-ripple
            clickable
            :class="{
              'selected-lesson': selectedLessonId === unit.lessonGuid,
            }"
          >
            <q-item-section
              class="column"
              @click="selectLesson(unit.lessonGuid)"
            >
              <div
                class="row items-center q-ml-md no-wrap"
                :class="unit.passed ? 'text-green-5' : 'text-black-5'"
              >
                <span
                  color="text-green-5"
                  class="q-mr-sm"
                  :class="unit.passed ? 'icon-check_circle' : 'icon-adjust'"
                ></span>
                <div class="q-ml-md">
                  {{ unit.name }}
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-virtual-scroll>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getLessonUnitIndexes } from '../../helpers/composables'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  lessons: { type: Array, required: true },
  isFavouriteCourse: { type: Boolean, required: true },
  selectedLessonId: { type: String, required: true },
})

const emit = defineEmits(['selectLesson', 'addToFavourites'])

const addToFavourites = () => {
  emit('addToFavourites')
}

const selectLesson = (lessonId) => {
  router.replace({ name: 'lesson', query: { lessonId } })
}

const selectedModule = ref('')

watchEffect(() => {
  if (props.lessons.length > 0) {
    const indexes = getLessonUnitIndexes(props.lessons, route.query.lessonId)
    selectedModule.value = indexes.moduleIndex
  }
})

const checkLessonPass = (lesson) => {
  const result = lesson.units.reduce(
    (acc, el) => (acc = acc && el.passed),
    true
  )
  return result
}

const getPassedLessons = (module) => {
  return module.units.filter((unit) => unit.passed).length
}

const lessonProgress = ref(0)
const moduleProgress = ref(0)

watchEffect(() => {
  let passedLessonsCount = 0
  let allLessonsCount = 0
  moduleProgress.value = 0
  props.lessons?.map((module) => {
    passedLessonsCount += module.units.filter((lesson) => lesson.passed).length
    if (
      module.units.length ===
      module.units.filter((lesson) => lesson.passed).length
    ) {
      moduleProgress.value++
    }

    allLessonsCount += module.units.length
  })

  if (passedLessonsCount === 0 || allLessonsCount === 0) {
    return 0
  }

  lessonProgress.value = (passedLessonsCount / allLessonsCount).toFixed(2)
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
