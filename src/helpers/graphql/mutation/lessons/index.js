import gql from 'graphql-tag'

const FIX_LESSON_PASSING = gql`
  mutation ($lessonGuid: String, $courseGuid: String, $status: String) {
    lmsMutation {
      fixLessonPassing(
        lessonGuid: $lessonGuid
        courseGuid: $courseGuid
        status: $status
      ) {
        errorCode
        errorMessage
        success
        successMessage
      }
    }
  }
`

const ADD_POST = gql`
  mutation ($param: String, $post: String) {
    lmsMutation {
      addPost(param: $param, post: $post) {
        errorCode
        errorMessage
        postId
        success
        successMessage
      }
    }
  }
`

export { FIX_LESSON_PASSING, ADD_POST }
