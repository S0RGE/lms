<template>
  <div class="category-picker">
    <router-link
      v-for="item in categories"
      :key="item"
      class="category-picker__item row items-center justify-center text-center"
      :to="{name: 'catalog'}"
    >
      {{ item }}
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  'Продукты Master',
  'Администрирование',
  'Версия 2018',
  'Обзоры SP IT-Enterprise',
  'Инструментальные средства развития (ИСР) IT-Enterprise',
  'Версия 2019',
  'Версия 2022',
  'Версия 2023',
  'Версия 2016',
  'Версия 2017',
  'Версия 2020',
  'Версия 2021',
])
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
