<template>
  <div id="course-program" class="course-program shadow-2 q-pa-sm bg-white">
    <div class="course-program__header row justify-between">
      <div class="text-h4 header">Программа курса</div>
      <div
        class="course-program__header__action text-primary"
        @click="expandAllItems"
      >
        <span :class="'icon-' + expandButtonIcon" style="color: #1a234b"></span>
        {{ expandButtonName }}
      </div>
    </div>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        v-for="program in expandedList"
        :key="program.id"
        v-model="program.expanded"
        class="expan-item"
      >
        <template #header>
          <q-item-section :class="{ 'passed-lesson': passedModule(program) }">
            <div class="text-weight-bold text-uppercase">
              {{ program.name }}
            </div>
            <div
              class="program-expand__text"
              :class="{ 'passed-lesson': passedModule(program) }"
            >
              <div>
                <span class="icon-access_time"></span>
                {{ moduleDuration(program.durationMinutes) }}
              </div>
              <div>
                <span class="icon-play_lesson"></span>
                {{ program.units.length }}
              </div>
            </div>
          </q-item-section>
        </template>
        <q-list bordered separator>
          <q-item
            v-for="unit in program.units"
            :key="unit.id"
            clickable
            class="column"
            :class="{ 'passed-lesson': unit.passed }"
            style="padding: 10px 25px"
            @click="movetoCourse(unit.lessonGuid)"
          >
            <q-item-section>{{ unit.name }}</q-item-section>
            <div
              class="row"
              style="display: flex; align-items: center"
              :class="{ 'passed-lesson': unit.passed }"
            >
              <span class="icon-videocam"></span>
              <span style="margin-left: 5px">{{
                unit.durationMinutesLabel
              }}</span>
            </div>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { computed, watchEffect, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  courseProgramData: {
    type: Array,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()

const expandedList = ref([])
const expandAll = ref(false)

watchEffect(() => {
  if (!props.courseProgramData.length) {
    return
  }
  props.courseProgramData.map((program) => {
    expandedList.value.push({ ...program, expanded: false })
  })
})

const movetoCourse = (unitId) => {
  router.push({
    name: 'lesson',
    params: {
      courseId: route.params.courseId,
    },
    query: {
      lessonId: unitId,
    },
  })
}

const passedModule = (module) => {
  const result = module.units.reduce((acc, unit) => {
    return unit.passed && acc
  }, true)

  return result
}

const expandAllItems = () => {
  expandAll.value = !expandAll.value
  expandedList.value.map((program) => {
    program.expanded = expandAll.value
  })
}

const expandButtonIcon = computed(() => {
  return expandAll.value ? 'expand_less' : 'expand_more'
})

const expandButtonName = computed(() => {
  return expandAll.value ? 'Свернуть все' : 'Развернуть все'
})

const moduleDuration = (duration) => {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours > 0 ? hours + 'Час' : ''} ${minutes} Мин`
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
