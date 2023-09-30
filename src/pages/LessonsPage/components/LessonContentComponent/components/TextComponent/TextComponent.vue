<template>
  <div class="max-size bordered">
    <div
      v-if="loading"
      class="row items-center justify-center"
      style="width: 100%; height: 500px"
    >
      <q-spinner-oval color="primary" size="3em" />
    </div>
    <div v-else class="max-size">
      <object
        v-if="!errors"
        :data="props.lessonMaterial"
        type="application/pdf"
        class="max-size"
        pagemode="none"
        useMap="true"
      ></object>
      <div v-else>
        <q-card class="error-content_card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Ошибка загрузки файла</div>
          </q-card-section>
          <div
            class="text-h5 row justify-center align-center q-mt-lg"
            style="height: 300px"
          >
            Извините, во время загрузки файла произошла ошибка
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const props = defineProps({
  lessonMaterial: { type: String, required: true },
})

const loading = ref(true)
const errors = ref(false)

watchEffect(() => {
  if (!props.lessonMaterial) {
    loading.value = false
    errors.value = true
    return
  }
  fetch(props.lessonMaterial).then((result) => {
    if (result.ok) {
      loading.value = false
    } else {
      loading.value = false
      errors.value = true
    }
  })
})

</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
