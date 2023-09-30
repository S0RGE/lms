const getCoursePassedPercentage = (modules) => {

  let passedLessonsCount = 0
  let allLessonsCount = 0
  modules.map((module) => {
    passedLessonsCount += module.units.filter((lesson) => lesson.passed).length
    allLessonsCount += module.units.length
  })

  if (passedLessonsCount === 0 || allLessonsCount === 0) {
    return 0
  }

  return (passedLessonsCount / allLessonsCount).toFixed(2)
}

export default getCoursePassedPercentage
