<template>
  <div v-if="ratingInfo" class="course-review shadow-2 q-pa-sm bg-white">
    <div class="course-review__header">
      <div class="text-h4 header text-center">Отзывы</div>
      <div>
        <q-btn flat label="Добавить отзыв" @click="card = !card" />
        <q-dialog v-model="card" class="review-dialog">
          <q-card class="my-card q-pa-md">
            <q-card-section>
              <q-input
                v-model="reviewText"
                outlined
                autogrow
                bg-color="white"
                class="review-text"
              />
            </q-card-section>
            <q-card-section align="center" class="q-mt-md">
              <q-rating v-model="userStars" :max="5" size="32px" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Закрыть" />
              <q-btn
                v-close-popup
                flat
                color="primary"
                label="Оценить"
                @click="addReview"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <q-card id="course-review" class="course-review__raiting">
      <q-card-section>
        <div class="raiting-item">
          <q-rating
            v-model="rating.overal"
            max="5"
            readonly
            size="1.2em"
            color="yellow"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            no-dimming
          />
        </div>
        <div>Рейтинг курса</div>
        <div>Оценок: {{ rating.count }}</div>
      </q-card-section>
      <q-card-section
        style="
          min-width: 500px;
          display: flex;
          flex-direction: column;
          padding-top: 10px;
        "
      >
        <q-linear-progress
          v-for="rating in rating.number"
          :key="rating"
          size="8px"
          :value="rating"
          color="warning"
          class="q-mt-md"
        />
      </q-card-section>
      <q-card-section
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
        "
      >
        <q-rating
          v-for="rating in rating.number"
          :key="rating"
          v-model="rating.value"
          readonly
          max="5"
          size="1.2em"
          color="yellow"
          icon="star_border"
          icon-selected="star"
          icon-half="star_half"
          no-dimming
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits('add-review')

const card = ref(false)
const userStars = ref(0)
const reviewText = ref('')

const addReview = () => {
  emit('add-review', {
    name: 'Review',
    date: Date.now(),
    comment: reviewText.value,
    rating: userStars.value,
  })

  reviewText.value = ''
  userStars.value = 0
}

// TODO: remove warnings
const props = defineProps({
  ratingInfo: {
    type: Object,
    required: true,
  },
})

const rating = computed(() => ({
  overal: props.ratingInfo?.ratinOverall,
  count: props.ratingInfo?.ratingCount,
  number: props.ratingInfo?.ratingsNumber,
}))
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
