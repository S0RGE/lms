import { getCourseDetails } from 'src/processes/courses'

const getLastPassedCourseLessonId = async (courseId) => {
  const currentCourse = await getCourseDetails(courseId)

  const passedLessons = []
  currentCourse.modules.forEach((module) => {
    passedLessons.push(...module.units.filter((lesson) => lesson.passed))
  })

  const lessonGuid =
    passedLessons.length > 0
      ? passedLessons[passedLessons.length - 1].lessonGuid
      : currentCourse.modules[0]?.units[0]?.lessonGuid

  return lessonGuid
}

export default getLastPassedCourseLessonId
