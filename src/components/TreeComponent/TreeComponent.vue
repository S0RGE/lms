<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="q-ml-md column">
    <div v-for="module in slicedTree" :key="module.id" class="q-mb-md">
      <div class="q-mb-sm" v-html="module.name"></div>
      <div v-if="module.lessons?.length" class="q-ml-md">
        <div
          v-for="lesson in module.lessons"
          :key="lesson.id"
          class="q-mb-sm text-primary"
        >
          <span class="icon-adjust q-mr-sm"> </span>
          <span
            class="lesson-link"
            @click="moveToLesson(lesson.lessonGuid)"
            v-html="lesson.name"
          ></span>
        </div>
      </div>
    </div>
    <q-btn
      v-if="elementsCount > MIN_LESSON_NUMBER"
      :label="moreButtonLabel"
      style="align-self: flex-end"
      @click="onShowMoreClick"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  treeTitle: {
    type: String,
    required: false,
    default: '',
  },
  treeChildren: {
    type: Array,
    required: true,
  },
  childrenLabel: {
    type: String,
    required: false,
    default: 'name',
  },
})

const emits = defineEmits(['move-to-lesson'])

const MIN_LESSON_NUMBER = 7

const showMore = ref(false)
const elementsCount = ref(0)

const moreButtonLabel = computed(() => {
  return showMore.value ? 'Свернуть' : 'Подробнее'
})

const slicedTree = computed(() => {
  if (props.treeChildren.length && !showMore.value) {
    return getMinTreeElements()
  }
  return props.treeChildren
})

const getMinTreeElements = () => {
  elementsCount.value = 0

  let slicedElements = []
  props.treeChildren.map((module, index) => {
    ++elementsCount.value
    if (elementsCount.value > MIN_LESSON_NUMBER) {
      return false
    }
    slicedElements.push({ ...module })

    if (module.lessons) {
      slicedElements[index].lessons = []
      module.lessons.map((lesson) => {
        ++elementsCount.value
        if (elementsCount.value <= MIN_LESSON_NUMBER) {
          slicedElements[index].lessons.push(lesson)
        }
      })
    }
    return true
  })

  return slicedElements
}

const onShowMoreClick = () => {
  showMore.value = !showMore.value
}

const moveToLesson = (lessonId) => {
  emits('move-to-lesson', lessonId)
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
