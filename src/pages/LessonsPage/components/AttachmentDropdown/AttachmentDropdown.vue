<template>
  <div class="q-mt-lg">
    <q-expansion-item
      expand-separator
      icon="add_circle"
      text-color="primary"
      label="Материалы урока"
    >
      <q-list class="column">
        <q-item
          v-for="attachment in props.attachmentOptions"
          :key="attachment.label"
          v-close-popup
          class="attachment-dropdown-item row"
          clickable
          @click="selectAttachment(attachment)"
        >
          <q-item-section style="flex: 1 1 45px; width: 45px; max-width: 45px">
            <span :class="'icon-' + attachment.icon" style="font-size: 1.4em">
            </span>
          </q-item-section>
          <q-item-section
            style="flex: 1 1 95px; width: 95px; max-width: 95px"
            >{{ attachment.label }}</q-item-section
          >
          <q-item-section
            style="align-items: flex-start; flex: 1 1 auto; width: 200px"
            >{{ attachment.description }}</q-item-section
          >
          <q-item-section
            v-if="
              attachment.type == 'TEXT' || attachment.type == 'PRESENTATION' || attachment.type == 'FILE'
            "
            style="align-items: flex-end; flex: 1 1 auto"
          >
            <p @click="getAttachment(attachment.value)">Скачать</p>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { saveLogs, saveErrorLogs } from 'src/processes/logs'

const emits = defineEmits(['select-attachment'])

const props = defineProps({
  attachmentOptions: {
    type: Array,
    required: true,
  },
})


const getAttachment = async (attachmentUrl) => {
  try {
    const response = await fetch(attachmentUrl)

    const blob = await response.blob()

    const url = URL.createObjectURL(blob)
    const fileExtension = attachmentUrl.split('.').pop()

    download(url, `file.${fileExtension}`)
    URL.revokeObjectURL(url)

    const userData = JSON.parse(localStorage.getItem('lms_user'))
    const log = JSON.stringify({
      pageName: 'Lesson component',
      eventName: 'download file',
      eventDate: new Date(),
      eventData: 'Download file: ' + url.toString(),
      ticket:
        userData[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
        ],
    })

    await saveLogs(log)
  } catch (error) {
    await errorHandle(error)
  }
}

const download = (path, filename) => {
  const anchor = document.createElement('a')
  anchor.href = path
  anchor.download = filename

  document.body.appendChild(anchor)

  anchor.click()

  document.body.removeChild(anchor)
}

const errorHandle = async (error) => {
  const stackError = new Error()
  const stack = stackError.stack
    .split('\n')
    .slice(2)
    .map((line) => line.replace(/\s+at\s+/, ''))
    .join('\n')

  const logData = {
    errorSource: 'Attachments component',
    errorName: 'Download attachment error',
    errorMessage: error.data.message,
    callsChain: stack,
  }

  await saveErrorLogs(logData)
}

const selectAttachment = (attachment) => {
  emits('select-attachment', attachment)
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
