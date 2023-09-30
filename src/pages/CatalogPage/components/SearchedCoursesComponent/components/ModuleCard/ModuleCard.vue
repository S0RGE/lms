<!-- eslint-disable vue/no-v-html -->
<template>
  <q-card v-if="course" bordered class="course-card row">
    <q-card-section style="width: 400px" class="course-card__image">
      <div>
        <q-img
          src="~assets/images/3.jpg"
          spinner-color="white"
          style="cursor: pointer; width: 350px"
          @click="moveToCourse"
        />
      </div>
      <div v-if="course.roles" class="row q-mt-sm">
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
      </div>
    </q-card-section>
    <q-card-section class="selectedPhrase" style="flex-grow: 2">
      <span
        class="text-h6"
        style="cursor: pointer"
        @click="moveToCourse"
        v-html="course.name"
      ></span>
      <tree-component
        v-if="course.modules?.length"
        :tree-children="course.modules"
        :tree-title="course.name"
        @move-to-lesson="moveToLesson"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

import TreeComponent from 'src/components/TreeComponent'

const router = useRouter()

const props = defineProps({
  course: { type: Object, required: true },
})

const moveToLesson = (lessonId) => {
  router.push({
    name: 'lesson',
    params: {
      courseId: props.course.courseGuid,
    },
    query: {
      lessonId,
    },
  })
}

const moveToCourse = () => {
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
