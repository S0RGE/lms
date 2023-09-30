// TODO: get icons
const lessonType = [
  { type: 'VIDEO', icon: 'videocam' },
  { type: 'TEXT', icon: 'note' },
  { type: 'TEST', icon: 'text-box-check-outline' },
  { type: 'VIDEO_YOUTUBE', icon: 'youtube-tv' },
  { type: 'WEB_PAGE', icon: 'file-outline' },
  { type: 'PRESENTATION', icon: 'note' },
  { type: 'FILE', icon: 'note' },
]

const lessonMaterialType = {
  FILE: {
    label: 'Файл',
    icon: 'file',
  },
  PRESENTATION: {
    label: 'Презентация',
    icon: 'co_present',
  },
  LINK: {
    label: 'Ссылка',
    icon: 'link',
  },
}

export { lessonType, lessonMaterialType }
