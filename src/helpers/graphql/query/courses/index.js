import gql from 'graphql-tag'

// TODO: create fragments

const AVAILABLE_COURSES = gql`
  query {
    lms {
      courses {
        isFavorite
        status
        entryLvl
        id
        courseGuid
        name
        coursGoals
        category {
          code
          name
        }
        products {
          name
          code
        }
        isFavorite
        description
        durationMinutes
        roles {
          name
          code
        }
        levels {
          name
          code
        }
      }
    }
  }
`

const COURSE_DETAILS = gql`
  query ($courseid: ID) @client {
    lms {
      courseDetails(courseGuid: $courseid) {
        course {
          description
          durationMinutes
          id
          status
          name
          courseGuid
          coursGoals
          exitSkills
          isFavorite
          exitKnowledge
          lessonsQty
          studentsReviews {
            name
            date
            comment
            rating
          }
          ratingInfo {
            ratingCount
            ratingsNumber
            ratinOverall
          }
          levels {
            name
            code
          }
          roles {
            name
            code
          }
        }
        errorcode
        errormessage
        modules {
          description
          durationMinutes
          progress
          id
          imageLink
          isFavorite
          lessonsQty
          levels {
            code
            name
          }
          moduleGuid
          name
          products {
            code
            name
          }
          progress
          ratingInfo {
            ratingCount
            ratingsNumber
            ratinOverall
          }
          roles {
            code
            name
          }
          type
          units {
            durationMinutesLabel
            durationMunute
            id
            lessonGuid
            lessonId
            lessonType
            materialsCount
            name
            passed
            questionsCount
            surveyId
            testId
          }
          unitsQtLabel
        }
        success
        successmessage
      }
    }
  }
`

const GET_COURSE_WITH_NAME = gql`
  query ($searchPhrase: String) {
    lms {
      getSearchResults(searchPhrase: $searchPhrase) {
        courses {
          name
          category {
            code
            name
          }
          courseGuid
          id
          levels {
            code
            name
          }
          description
          roles {
            code
            name
          }
          modules {
            name
            id
            lessons {
              id
              lessonGuid
              name
            }
          }
        }
        eRRORMESSAGE
        eRRORCODE
        sUCCESS
        sUCCESSMESSAGE
      }
    }
  }
`

const GET_POPULAR_COURSES = gql`
  query {
    lms {
      popular {
        category {
          code
          name
        }
        courseGuid
        name
        status
        description
        durationMinutes
        levels {
          code
          name
        }
        roles {
          code
          name
        }
      }
    }
  }
`

const GET_COMPLETED_COURSES = gql`
  query {
    lms {
      completedCourses {
        category {
          code
          name
        }
        courseGuid
        name
        description
        durationMinutes
        levels {
          code
          name
        }
        roles {
          code
          name
        }
      }
    }
  }
`

const ASSIGNED_COURSES = gql`
  query {
    lms {
      assignedCourses
    }
  }
`

const GET_RECOMMENDED_COURSES = gql`
  query {
    lms {
      recommended {
        courses {
          category {
            code
            name
          }
          status
          courseGuid
          name
          description
          durationMinutes
          levels {
            code
            name
          }
          roles {
            code
            name
          }
        }
      }
    }
  }
`

const GET_STARTED_COURSES = gql`
  query {
    lms {
      startedCourses {
        isFavorite
        status
        entryLvl
        id
        courseGuid
        name
        coursGoals
        category {
          code
          name
        }
        products {
          name
          code
        }
        isFavorite
        description
        durationMinutes
        roles {
          name
          code
        }
        levels {
          name
          code
        }
      }
    }
  }
`

const FAVOURITE_COURSES = gql`
  query {
    lms {
      favoriteCourses {
        category {
          code
          name
        }
        courseGuid
        name
        description
        durationMinutes
        levels {
          code
          name
        }
        roles {
          code
          name
        }
      }
    }
  }
`

export {
  AVAILABLE_COURSES,
  COURSE_DETAILS,
  GET_COURSE_WITH_NAME,
  GET_POPULAR_COURSES,
  ASSIGNED_COURSES,
  GET_RECOMMENDED_COURSES,
  GET_STARTED_COURSES,
  FAVOURITE_COURSES,
  GET_COMPLETED_COURSES,
}
