<template>
  <div class="home-page main-container q-mb-md">
    <bread-crumbs-component :crumbs="[{ name: 'Каталог курсов' }]" />
    <div class="flex items-center q-mt-md justify-between">
      <div class="text-primary q-mb-md" style="max-width: 800px">
        <q-tabs v-model="selectedCourseType">
          <q-tab
            v-for="tab in courseType"
            :key="tab.name"
            :name="tab.name"
            :label="tab.label"
          >
            <q-badge color="primary" floating
              >{{ courseQtyByTab(tab.name) }}
            </q-badge>
          </q-tab>
        </q-tabs>
      </div>
      <q-input
        v-model.lazy="searchKeyWord"
        outlined
        bottom-slots
        dense
        label="Поиск"
        @keyup.enter="searchCoursesByKeyWord"
      >
        <template #append>
          <span
            v-if="searchKeyWord !== ''"
            class="cursor-pointer icon-close"
            @click="clearSearchCourses"
          ></span>
          <span class="icon-search"></span>
        </template>
      </q-input>
    </div>
    <div class="home-page__selectors row items-center q-my-md">
      <div class="lt-lg" style="align-self: flex-end">
        <q-btn
          label="Фильтр"
          icon="filter_alt"
          @click="toggleFiltersShow = !toggleFiltersShow"
        />
      </div>
      <div
        class="home-page__selectors__all text-primary"
        style="min-width: 130px"
      >
        <b
          >ВЫБРАНО:
          {{
            findedCourses.length
              ? findedCourses.length
              : filteredCoursesByTag.length
          }}</b
        >
      </div>
      <div style="width: 78%" class="gt-md">
        <div
          v-for="filter in currentFilters"
          :key="filter.name"
          class="home-page__selectors__chip row"
        >
          <div
            v-if="filterItemIsSelected"
            class="cursor-pointer"
            @click="clearFilters"
          >
            <q-chip removable outline @remove="clearFilters">
              Очистить фильтр
            </q-chip>
          </div>
          <div v-for="item in filter.items" :key="item.code">
            <q-chip
              v-if="item.selected"
              removable
              outline
              @remove="removeFilterItemByChip(filter.type, item.code)"
            >
              {{ item.name }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>
    <main class="main">
      <filters-component
        :class="{
          'hidden-filter': $q.screen.lt.lg,
          'pos-absolute': $q.screen.lt.lg && toggleFiltersShow,
        }"
        :filters="availableFilters"
        @filters-handle="setCategoriesFilter"
      />
      <div
        v-if="coursesLoader"
        class="row items-center justify-center course-spinner"
      >
        <q-spinner-oval color="primary" size="2em" />
      </div>
      <paginated-course-list
        v-else-if="!coursesLoader && !isCourseFinding"
        :courses="filteredCoursesByTag"
        class="q-mb-md"
      />
      <searched-courses-component
        v-if="isCourseFinding"
        :courses="filteredCoursesByTag"
      />
    </main>
  </div>
</template>

<script setup>
// Libraries
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

// Components
import BreadCrumbsComponent from 'src/components/BreadCrumbsComponent'
import PaginatedCourseList from 'src/components/PaginatedCourseList'
import FiltersComponent from './components/FiltersComponent'
import SearchedCoursesComponent from './components/SearchedCoursesComponent'

// Static data
import courseType from './helpers/staticData/courseType'

// Methods
import { getAvailableCourses, getCoursesWithName } from 'src/processes/courses'
import { getAvailableFilters } from 'src/processes/filters'
import {
  handleGetAvailableFilters,
  filterCoursesByTag,
} from './helpers/composables/filters'
import { saveErrorLogs } from 'src/processes/logs'

const $q = useQuasar()

// Filters
const availableFilters = ref({})
const currentFilters = ref([])
const toggleFiltersShow = ref(false)

/**
 * Clears all filters and resets their selected state.
 *
 * @return {void} No return value.
 */
const clearFilters = () => {
  currentFilters.value = []
  availableFilters.value.map((filter) => {
    filter.items.map((item) => {
      item.selected = false
      item.children?.map((child) => {
        child.selected = false
      })
    })
  })
}

/**
 * Show is any filter is selected
 *
 * @return {boolean} Any filter is selected.
 */
const filterItemIsSelected = computed(() => {
  return currentFilters.value.some((filter) => {
    return filter.items.some((item) => {
      return item.selected
    })
  })
})

/**
 * Removes a filter item by chip.
 *
 * @param {string} filterType - The type of filter.
 * @param {string} filterItemCode - The code of the filter item to be removed.
 */
const removeFilterItemByChip = (filterType, filterItemCode) => {
  availableFilters.value.map((filter) => {
    if (filter.type !== filterType) return

    filter.items.map((item) => {
      let categoryChecked = 0

      if (item.code === filterItemCode) {
        item.selected = false
        item.children?.map((child) => {
          child.selected = false
        })
      }
      item.children?.map((child) => {
        child.code === filterItemCode
          ? (child.selected = false)
          : child.selected
        categoryChecked += child.selected ? 1 : 0
      })

      const result = categoryChecked / item.children?.length
      if (result > 0 && result < 1) {
        item.selected = null
      } else {
        item.selected = !!result
      }
    })
  })

  currentFilters.value = currentFilters.value.filter((filter) => {
    if (filter.type !== filterType) return true
    filter.items = filter.items.filter((item) => item.code !== filterItemCode)
    return filter.items.length > 0
  })
}

/**
 * Clears the search input, resets the search status, and clears the found courses list.
 *
 * @return {void}
 */
const clearSearchCourses = () => {
  searchKeyWord.value = ''
  isCourseFinding.value = false
  findedCourses.value = []
}

// Courses

// State that courses is searching by key word
const isCourseFinding = ref(false)
// Courses serched by key word
const findedCourses = ref([])

const searchKeyWord = ref('')
const availableCourses = ref({})
const coursesLoader = ref(true)

/**
 * Search courses by key word if it is not empty and set findedCourses.
 * If key word is empty, set findedCourses to empty array.
 *
 * @return {void} - if key word is empty return void.
 */
const searchCoursesByKeyWord = async () => {
  isCourseFinding.value = false
  coursesLoader.value = true
  if (!searchKeyWord.value) {
    clearSearchCourses()
    coursesLoader.value = false
    return
  }
  const response = await getCoursesWithName(searchKeyWord.value)
  findedCourses.value = response.courses
  isCourseFinding.value = true
  coursesLoader.value = false
}

const setCategoriesFilter = (filters) => {
  currentFilters.value = filters
}

const filteredCoursesByTag = computed(() => {
  if (isCourseFinding.value) {
    return filterCoursesByTag(currentFilters.value, findedCourses.value)
  } else if (!typedCourses.value?.length || !currentFilters.value.length) {
    return typedCourses.value
  }

  return filterCoursesByTag(currentFilters.value, typedCourses.value)
})

// Tabs
const selectedCourseType = ref('ALL')

// TODO: Code duplication
const typedCourses = computed(() => {
  if (selectedCourseType.value === 'ALL') return availableCourses.value
  if (selectedCourseType.value === 'IS_FAVOURITE') {
    return availableCourses.value.filter((course) => course.isFavorite)
  } else if (selectedCourseType.value === 'AVAILABLE') {
    return availableCourses.value.filter(
      (course) => course.status !== 'UNAVAILABLE'
    )
  }
  return availableCourses.value.filter(
    (course) => course.status === selectedCourseType.value
  )
})

// TODO: Code duplication
const courseQtyByTab = (tab) => {
  if (!availableCourses.value.length || !tab) return
  if (tab === 'ALL') return availableCourses.value.length
  if (tab === 'IS_FAVOURITE') {
    return availableCourses.value.filter((course) => course.isFavorite).length
  } else if (tab === 'AVAILABLE') {
    return availableCourses.value.filter(
      (course) => course.status !== 'UNAVAILABLE'
    ).length
  }
  return availableCourses.value.filter((course) => course.status === tab).length
}

onMounted(() => {
  getAvailableFilters()
    .then((filters) => {
      availableFilters.value = handleGetAvailableFilters(filters)
    })
    .catch((error) => {
      const logData = {
        errorSource: 'Catalog page',
        errorName: 'Failed get available filters',
        errorMessage: JSON.stringify(error),
        callsChain: '',
      }

      saveErrorLogs(logData)
    })
  getAvailableCourses()
    .then((courses) => {
      availableCourses.value = courses
      coursesLoader.value = false
    })
    .catch((error) => {
      const logData = {
        errorSource: 'Catalog page',
        errorName: 'Failed get available courses',
        errorMessage: JSON.stringify(error),
        callsChain: '',
      }

      saveErrorLogs(logData)
    })
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
