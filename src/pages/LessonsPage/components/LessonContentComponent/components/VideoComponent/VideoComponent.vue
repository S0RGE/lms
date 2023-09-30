<template>
  <div class="video-wrapper">
    <div
      v-if="videoLoader"
      class="row items-center justify-center"
      style="width: 100%; height: 500px"
    >
      <q-spinner-oval color="primary" size="4em" />
    </div>
    <div v-show="!videoLoader" style="height: 100%">
      <div v-if="!videoError" class="video-wrapper__content">
        <video
          id="example-video"
          ref="videoPlayer"
          controls
          name="lesson-video"
          class="video-player-wrapper"
          @error="errorHandle"
          @ended="endedHandle"
          @play="playHandle"
          @pause="pauseHandle"
        ></video>
      </div>
      <div v-else class="error-content">
        <q-card class="error-content_card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Ошибка загрузки файла</div>
          </q-card-section>
          <div
            class="text-h5 row justify-center align-center q-mt-lg"
            style="height: 500px"
          >
            Извините, во время загрузки файла произошла ошибка
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import 'dashjs'

import { saveLogs, saveErrorLogs } from 'src/processes/logs'
import dashjs from 'dashjs'

const emit = defineEmits(['fixLessonPassing'])

const props = defineProps({
  videoUrl: {
    type: String,
    required: true,
  },
})

const videoPlayer = ref(null)
const player = ref({})

const videoLoader = ref(true)

const videoError = ref(null)

const errorHandle = async (error) => {
  const stackError = new Error()

  const stack = stackError.stack
    .split('\n')
    .slice(2)
    .map((line) => line.replace(/\s+at\s+/, ''))
    .join('\n')

  const logData = {
    errorSource: 'VideoComponent videojs',
    errorName: 'Media Error',
    errorMessage: error.data.message,
    callsChain: stack,
  }

  // Temporary fix: if error is download error then fix lesson passing
  if (error.code === 27 && error.data.request.action === 'download') {
    emit('fixLessonPassing')
  }

  await saveErrorLogs(logData)

  // videoError.value = error
  videoLodaded()
}

const playHandle = async () => {
  videoIsPlaying.value = true
  const userData = JSON.parse(localStorage.getItem('lms_user'))
  const log = JSON.stringify({
    pageName: 'Video component',
    eventName: 'Start video',
    eventDate: new Date(),
    eventData: 'Video started',
    ticket:
      userData[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
      ],
  })

  await saveLogs(log)
}

const pauseHandle = async () => {
  videoIsPlaying.value = false
  await playerEndedVideo()
}

const videoIsPlaying = ref(false)
const playerEndedVideo = async () => {
  const userData = JSON.parse(localStorage.getItem('lms_user'))
  const log = JSON.stringify({
    pageName: 'Video component',
    eventName: 'End video',
    eventDate: new Date(),
    eventData: 'Video ended',
    ticket:
      userData[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
      ],
  })
  await saveLogs(log)
}

const endedHandle = async () => {
  emit('fixLessonPassing')
}

const videoLodaded = () => {
  videoLoader.value = false
}

onMounted(() => {
  const protData = {
    'org.w3.clearkey': {
      clearkeys: {
        'aHlOOUlLR2ZXS2RBd0ZhRTVwbTBxZw==': 'b1c1QUs1Qlc0M0h6YlRTS3BpdTNTUQ==',
      },
    },
  }
  // eslint-disable-next-line no-undef
  player.value = dashjs.MediaPlayer().create()

  player.value.initialize(videoPlayer.value, props.videoUrl, false)

  player.value.setProtectionData(protData)

  player.value.on('error', (error) => {
    errorHandle(error.error)
  })

  player.value.on('ready', function () {
    videoLodaded()
  })

  player.value.on('bufferLoaded', function () {
    videoLodaded()
  })
})

onUnmounted(async () => {
  player.value.destroy()
  if (videoIsPlaying.value) {
    await playerEndedVideo()
  }
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
