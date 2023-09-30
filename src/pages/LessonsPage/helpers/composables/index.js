const getLessonUnitIndexes = (modules, lessonId) => {
  const result = {}
  modules.map((module, moduleIndex) => {
    const findedLesson = module.units.find((lesson, lessonIndex) => {
      if (lesson.lessonGuid === lessonId) {
        result.lessonIndex = lessonIndex
        result.moduleIndex = moduleIndex
        return true
      }
    })
    if (findedLesson) return
  })

  return result
}

export { getLessonUnitIndexes }