import gql from 'graphql-tag'

const LESSON_CONTENT = gql`
  query ($lessonGuid: ID, $courseId: ID, $isFree: Boolean) {
    lms {
      lessonContent(
        lessonGuid: $lessonGuid
        courseId: $courseId
        isFree: $isFree
      ) {
        lesson {
          name
          lessonType
          durationMunute
          passed
        }
        lessonmaterials {
          link
          name
          type
        }

        content
        errorcode
        errormessage

        success
        successmessage
      }
    }
  }
`

export { LESSON_CONTENT }
