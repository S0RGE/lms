<template>
  <q-breadcrumbs class="app-container breadcrumb-container">
    <template #separator>
      <span class="icon-chevron_right"></span>
    </template>
    <q-breadcrumbs-el to="/" class="text-primary"
      ><span class="icon-home"></span
    ></q-breadcrumbs-el>
    <q-breadcrumbs-el
      v-for="crumb in props.crumbs"
      :key="crumb.to"
      :label="crumb.name"
      :to="crumb.to"
    />
  </q-breadcrumbs>
</template>

<script setup>
// import { computed } from 'vue'
// import { useRoute } from 'vue-router'

// const route = useRoute()

const props = defineProps({
  crumbs: {
    type: Array,
    required: true,
  },
})

// const crumbs = computed(() => {
//   if (typeof route.meta.breadCrumbs === 'function') {
//     const result = route.meta.breadCrumbs.call(this, route)
//     return result
//   }

//   return route.meta.breadCrumbs
// })
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
