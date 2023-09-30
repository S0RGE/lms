<template>
  <div class="lesson-page__wrapper">
    <div class="main-container">
      <bread-crumbs-component class="q-my-md" :crumbs="crumbs" />
      <div class="lesson-page column justify-between" style="min-height: 100%">
        <div class="lesson-page__main row no-wrap">
          <div class="lesson-page__main__content">
            <lesson-content-component
              v-if="selectedLessonAttachmentLink"
              :selected-lesson-type="selectedLessonAttachmentType.type"
              :selected-lesson-link="selectedLessonAttachmentLink"
              @fix-lesson-passing="onFixLessonPassing"
            />
            <div v-else class="alternative_lesson-data">
              <q-img src="~assets/images/3.jpg" spinner-color="white" />
            </div>
            <attachment-dropdown
              v-if="selectedLessonId"
              :attachment-options="attachmentOptions"
              @select-attachment="onSelectAttachment"
            />
          </div>
          <lesson-list
            class="gt-md"
            :lessons="currentCourseModules"
            :is-favourite-course="isFavouriteCourse"
            :selected-lesson-id="selectedLessonId"
            @add-to-favourites="onAddToFavourites"
          />
        </div>
        <div class="lesson-page__navigation shadow-1 row items-center">
          <div class="lesson-page__navigation__content row justify-between">
            <q-btn
              class="nav-button"
              icon="chevron_left"
              flat
              color="primary"
              style="width: 200px"
              @click="previousLesson"
            >
              Предыдущий урок
            </q-btn>
            <q-btn
              flat
              color="primary"
              icon-right="chevron_right"
              style="width: 200px"
              class="nav-button"
              @click="nextLesson"
            >
              Следующий урок
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Libraries
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Components
import BreadCrumbsComponent from 'src/components/BreadCrumbsComponent'
import LessonList from './components/LessonList'
import LessonContentComponent from './components/LessonContentComponent'
import AttachmentDropdown from './components/AttachmentDropdown'

// Methods
import { getLessonContent, fixLessonPassing } from 'src/processes/lessons'
import { getLessonUnitIndexes } from './helpers/composables'
import {
  getCourseDetails,
  addCourseToFavourites,
  removeCourseFromFavourites,
} from 'src/processes/courses'

// Static data
import { lessonType, lessonMaterialType } from './helpers/staticData'

const $q = useQuasar()

const route = useRoute()
const router = useRouter()

// Current course
const courseDetails = ref(null)
const isFavouriteCourse = computed(
  () => courseDetails.value?.course?.isFavorite || false
)
const currentCourseModules = computed(() => courseDetails.value?.modules || [])

// Selected lesson
const selectedLessonId = computed(() => route.query.lessonId || '')
const selectedLessonAttachmentType = ref(lessonType[0])
const selectedLessonAttachmentLink = ref('')
const selectedLessonContent = ref([])

const onSelectAttachment = (attachment) => {
  selectedLessonAttachmentLink.value = attachment.value
  selectedLessonAttachmentType.value = lessonType.find(
    (el) => el.type === attachment.type
  )
}

const attachmentOptions = computed(() => {
  const options = [
    {
      label: 'Видео',
      value: selectedLessonContent.value?.content,
      description: 'Видео лекция',
      icon: 'videocam',
      type: 'VIDEO',
    },
  ]

  if (selectedLessonContent.value?.lessonmaterials?.length > 0) {
    selectedLessonContent.value.lessonmaterials.map((material) => {
      options.push({
        label: lessonMaterialType[material.type].label,
        value: material.link,
        description: material.name,
        icon: lessonMaterialType[material.type].icon,
        type: material.type,
      })
    })
  }

  return options
})

// Get lesson content when lesson is selected
watchEffect(async () => {
  if (!selectedLessonId.value) return

  selectedLessonContent.value = await getLessonContent(
    route.query.lessonId,
    route.params.courseId
  )

  selectedLessonAttachmentLink.value = selectedLessonContent.value.content
  selectedLessonAttachmentType.value = lessonType[0]
})

const fetchCourseDetails = () => {
  getCourseDetails(route.params.courseId).then((details) => {
    courseDetails.value = details
  })
}

const onAddToFavourites = async () => {
  if (courseDetails.value.course.isFavorite) {
    const result = await removeCourseFromFavourites(route.params.courseId)
    // TODO: use cache
    if (result) {
      $q.notify({
        message: 'Курс удален из избранного',
      })
      fetchCourseDetails()
    }
  } else {
    const result = await addCourseToFavourites(route.params.courseId)
    // TODO: use cache
    if (result) {
      $q.notify({
        message: 'Курс добавлен в избранное',
      })
      fetchCourseDetails()
    }
  }
}

const previousLesson = async () => {
  if (!selectedLessonId.value) return
  const { lessonIndex, moduleIndex } = getLessonUnitIndexes(
    currentCourseModules.value,
    selectedLessonId.value
  )

  if (lessonIndex <= 0) {
    if (moduleIndex <= 0) {
      return
    } else {
      router.replace({
        name: 'lesson',
        query: {
          lessonId:
            currentCourseModules.value[moduleIndex - 1].units[
              currentCourseModules.value[moduleIndex - 1].units.length - 1
            ].lessonGuid,
        },
      })
    }
  } else {
    router.replace({
      name: 'lesson',
      query: {
        lessonId:
          currentCourseModules.value[moduleIndex].units[lessonIndex - 1]
            .lessonGuid,
      },
    })
  }
}

const nextLesson = async () => {
  if (!selectedLessonId.value) return
  const { lessonIndex, moduleIndex } = getLessonUnitIndexes(
    currentCourseModules.value,
    selectedLessonId.value
  )

  if (lessonIndex >= currentCourseModules.value[moduleIndex].units.length - 1) {
    if (moduleIndex >= currentCourseModules.value.length - 1) {
      return
    } else {
      router.replace({
        name: 'lesson',
        query: {
          lessonId:
            currentCourseModules.value[moduleIndex + 1].units[
              currentCourseModules.value[moduleIndex + 1].units.length - 1
            ].lessonGuid,
        },
      })
    }
  } else {
    router.replace({
      name: 'lesson',
      query: {
        lessonId:
          currentCourseModules.value[moduleIndex].units[lessonIndex + 1]
            .lessonGuid,
      },
    })
  }
}

const onFixLessonPassing = async () => {
  if (!selectedLessonContent.value.lesson.passed) {
    await fixLessonPassing(route.query.lessonId, route.params.courseId)
    fetchCourseDetails()
  }
}

// Bread crumbs
const crumbs = computed(() => {
  const result = [
    {
      name: 'Каталог курсов',
      to: '/catalog',
    },
    {
      name: courseDetails.value?.course?.name,
      to: `/course/${route.params.courseId}`,
    },
    {
      name: selectedLessonContent?.value?.lesson?.name || 'Уроки',
      // to: `/lesson/${route.params.courseId}`,
    },
  ]

  return result
})

onMounted(() => {
  fetchCourseDetails()
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
