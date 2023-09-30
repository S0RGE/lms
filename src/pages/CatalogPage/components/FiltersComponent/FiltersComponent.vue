<template>
  <div class="filter-wrapper">
    <q-list v-if="filters.length" bordered class="rounded-borders filter-main">
      <q-expansion-item
        v-for="(category, categoryIndex) in filters"
        :key="category.type"
        expand-separator
        :label="category.name"
        class="expand-separator"
      >
        <q-list>
          <q-item
            v-for="item in category.items"
            :key="item.code"
            v-ripple
            class="filter-item"
            toggle-indeterminate
            clickable
          >
            <q-item-section
              v-if="item.children"
              class="row no-wrap item-children q-pl-none q-ml-md"
            >
              <q-checkbox
                v-model="item.selected"
                color="primary"
                @click="handleSelectedCategory(item, categoryIndex)"
              />
              <q-expansion-item
                :label="cutTheTitle(item.name)"
                :title="item.name"
                class="expand-separator inner-child"
              >
                <q-list>
                  <q-item
                    v-for="children in item.children"
                    :key="children.code"
                    v-ripple
                    clickable
                  >
                    <q-checkbox
                      v-model="children.selected"
                      :title="children.name"
                      :label="cutTheTitle(children.name)"
                      color="primary"
                      @click="handleSelectedFilters"
                    />
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-item-section>
            <q-item-section v-else>
              <q-checkbox
                v-model="item.selected"
                :label="cutTheTitle(item.name)"
                :title="item.name"
                color="primary"
                @click="handleSelectedCategory(item, categoryIndex)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
const emit = defineEmits(['filtersHandle'])

const props = defineProps({
  filters: { type: Object, required: true },
})

const handleSelectedCategory = (categoryItem, categoryIndex) => {
  props.filters[categoryIndex].items.map((item) => {
    if (item.name === categoryItem.name) {
      item.selected = categoryItem.selected
      if (item.children) {
        item.children.map((child) => (child.selected = item.selected))
      }
    }
  })
  
  handleSelectedFilters()
}

const handleSelectedFilters = () => {
  const filters = []

  props.filters.map((f) => {
    let items
    let children = []
    items = f.items.filter((item) => {
      if (item.children) {
        checkboxValue(item)
        if (item.selected) {
          children = [...children, ...item.children]
          return false
        } else {
          children = [...children, ...item.children.filter((c) => c.selected)]
        }
      }
      return item.selected
    })

    if (items.length > 0 || children.length > 0) {
      filters.push({
        ...f,
        items: [...items, ...children],
      })
    }
  })

  emit('filtersHandle', filters)
}

const checkboxValue = (checkboxModel) => {
  let result = 0
  if (checkboxModel.children) {
    checkboxModel.children.map((child) => {
      result += child.selected ? 1 : 0
    })
    result = result / checkboxModel.children.length
    if (result > 0 && result < 1) {
      checkboxModel.selected = null
    } else {
      checkboxModel.selected = !!result
    }
  }
}

const cutTheTitle = (title) => {
  return title.length > 20 ? title.substring(0, 17) + '...' : title
}
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
