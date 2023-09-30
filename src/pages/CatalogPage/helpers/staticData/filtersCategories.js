import { ref } from 'vue'

const filtersType = ref([
  { type: 'categories', key: 'Категория' },
  { type: 'roles', key: 'Роль' },
  { type: 'levels', key: 'Уровень' },
  { type: 'products', key: 'Продукт' },
])

export default filtersType
