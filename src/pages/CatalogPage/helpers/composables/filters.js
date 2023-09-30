import filtersType from '../staticData/filtersCategories'
import { computed } from 'vue'

const handleGetAvailableFilters = (availableFilters) => {
  const normalizedFilters = []

  filtersType.value.map((filterType) => {
    normalizedFilters.push({
      name: filterType.key,
      type: filterType.type,
      parentcode: filterType.parentcode,
      selected: 0,
      items: availableFilters[filterType.type].map((filter) => {
        return { ...filter, selected: false }
      }),
    })
  })

  normalizedFilters[0].items.map((el, index, ar) => {
    const res = ar.filter((e) => e.parentcode === el.code)
    if (res?.length) {
      normalizedFilters[0].items[index].children = res
    }
  })

  // Delete filters here because in upper map there is conflict in indexes
  normalizedFilters[0].items.map((el) => {
    normalizedFilters[0].items = normalizedFilters[0].items.filter(
      (e) => e.parentcode !== el.code
    )
  })

  return normalizedFilters
}

const filteredCoursesByName = (filteredCoursesByTag, searchCourse) =>
  computed(() => {
    let fCourses = {}
    if (filteredCoursesByTag.value && searchCourse.value.trim()) {
      fCourses = filteredCoursesByTag.value.filter((el) => {
        const courseName = el.name
        const search = searchCourse.value
        return courseName.toLowerCase().includes(search.toLowerCase())
      })

      return fCourses
    }

    return filteredCoursesByTag.value
  })

const filterCoursesByTag = (currentFilters, typedCourses) => {
  const result = typedCourses.filter((course) => {
    let filterConfirmed = true
    currentFilters.map((filter) => {
      if (filter.type === 'categories') {
        filterConfirmed =
          filterConfirmed &&
          filter.items.reduce(
            (acc, el) =>
              (acc = acc || (el.code === course.category.code && el.selected)),
            false
          )
      } else if (filter.type === 'roles') {
        filterConfirmed =
          filterConfirmed &&
          filter.items.reduce((acc, f) => {
            return (acc = acc || course.roles.find((c) => c.code === f.code))
          }, false)
      } else if (filter.type === 'levels') {
        filterConfirmed =
          filterConfirmed &&
          filter.items.reduce((acc, f) => {
            return (acc = acc || course.levels.find((c) => c.code === f.code))
          }, false)
      } else if (filter.type === 'products') {
        filterConfirmed =
          filterConfirmed &&
          filter.items.reduce((acc, f) => {
            return (acc = acc || course.products.find((c) => c.code === f.code))
          }, false)
      }
    })

    return filterConfirmed
  })

  return result
}

export { handleGetAvailableFilters, filteredCoursesByName, filterCoursesByTag }
