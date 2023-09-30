import gql from 'graphql-tag'

const ADD_COURSE_TO_FAVOURITE = gql`
  mutation ($courseId: String) {
    lmsMutation {
      addfavouritecourse(courseId: $courseId)
    }
  }
`

const REMOVE_COURSE_FROM_FAVOURITE = gql`
  mutation ($courseId: String) {
    lmsMutation {
      deletefavouritecourse(courseId: $courseId)
    }
  }
`

const FIX_START_COURSE = gql`
  mutation ($courseGuid: String) {
    lmsMutation {
      fixStartCourse(courseGuid: $courseGuid) {
        success
        successMessage
        errorCode
        errorMessage
      }
    }
  }
`

const ADD_REVIEW = gql`
  mutation ($id: Long, $type: Int, $rating: String) {
    lmsMutation {
      addReview(id: $id, type: $type, rating: $rating) {
        errorCode
        errorMessage
        success
        successMessage
      }
    }
  }
`

export {
  ADD_COURSE_TO_FAVOURITE,
  REMOVE_COURSE_FROM_FAVOURITE,
  FIX_START_COURSE,
  ADD_REVIEW,
}
