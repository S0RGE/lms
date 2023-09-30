import {
  AVAILABLE_COURSES,
  COURSE_DETAILS,
  GET_COURSE_WITH_NAME,
  GET_POPULAR_COURSES,
  // ASSIGNED_COURSES,
  GET_RECOMMENDED_COURSES,
  GET_COMPLETED_COURSES,
  GET_STARTED_COURSES,
  // FAVOURITE_COURSES,
} from 'src/helpers/graphql/query/courses'

import {
  ADD_COURSE_TO_FAVOURITE,
  REMOVE_COURSE_FROM_FAVOURITE,
  FIX_START_COURSE,
  ADD_REVIEW,
} from 'src/helpers/graphql/mutation/courses'

import { saveLogs, saveErrorLogs } from 'src/processes/logs'

import defaultApolloClient from 'src/helpers/graphql/defaultApolloClient'

const getCoursesWithName = async (searchPhrase) => {
  const result = await defaultApolloClient.query({
    query: GET_COURSE_WITH_NAME,
    variables: {
      searchPhrase,
    },
  })

  return result.data.lms.getSearchResults
}
const fixStartCourse = async (courseId) => {
  try {
    await defaultApolloClient.mutate({
      mutation: FIX_START_COURSE,
      variables: {
        courseGuid: courseId,
      },
    })

    const userData = JSON.parse(localStorage.getItem('lms_user'))
    const log = JSON.stringify({
      pageName: 'page',
      eventName: 'fix start course',
      eventDate: new Date(),
      eventData: 'Course starts successfully',
      ticket:
        userData[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'
        ],
    })

    saveLogs(log)
  } catch (e) {
    const log = {
      errorSource: 'fix start course',
      errorName: 'Fix start course error',
      errorMessage: e.message,
      callsChain: e.stack,
    }

    saveErrorLogs(log)
  }
}

const getCourseDetails = async (courseId) => {
  const courseDetailsData = await defaultApolloClient.query({
    query: COURSE_DETAILS,
    variables: {
      courseid: courseId,
    },
    fetchPolicy: 'network-only',
  })

  return courseDetailsData.data.lms.courseDetails
}

const getCompletedCourses = async () => {
  const availableCourses = await defaultApolloClient.query({
    query: GET_COMPLETED_COURSES,
  })

  return availableCourses.data.lms.courses
}

const getStartedCourses = async () => {
  const startedCourses = await defaultApolloClient.query({
    query: GET_STARTED_COURSES,
  })

  return startedCourses.data.lms.startedCourses
}

const getAvailableCourses = async () => {
  const availableCourses = await defaultApolloClient.query({
    query: AVAILABLE_COURSES,
  })

  return availableCourses.data.lms.courses
}

const getPopularCourses = async () => {
  const popularCourses = await defaultApolloClient.query({
    query: GET_POPULAR_COURSES,
  })

  return popularCourses.data.lms.popular
}

const getRecommendedCourses = async () => {
  const recommendedCourses = await defaultApolloClient.query({
    query: GET_RECOMMENDED_COURSES,
  })

  return recommendedCourses.data.lms.recommended.courses
}

const addCourseToFavourites = async (courseId) => {
  const result = await defaultApolloClient.mutate({
    mutation: ADD_COURSE_TO_FAVOURITE,
    variables: {
      courseId,
    },
    // update: (cache) => {
    //   let details = cache.readQuery({
    //     query: COURSE_DETAILS,
    //     variables: { courseid: courseId },
    //   })
    //   cache.writeQuery({
    //     query: COURSE_DETAILS,
    //     data: {
    //       lms: {
    //         ...details.lms,
    //         course: {
    //           ...details.lms.courseDetails.course,
    //           isFavorite: true,
    //         },
    //       },
    //     },
    //   })
    // },
  })

  return result.data.lmsMutation.addfavouritecourse
}

const removeCourseFromFavourites = async (courseId) => {
  const result = await defaultApolloClient.mutate({
    mutation: REMOVE_COURSE_FROM_FAVOURITE,
    variables: {
      courseId,
    },
    update: (cache) => {
      let details = cache.readQuery({
        query: COURSE_DETAILS,
        variables: { courseid: courseId },
      })
      cache.writeQuery({
        query: COURSE_DETAILS,
        data: {
          lms: {
            ...details.lms,
            course: {
              ...details.lms.courseDetails.course,
              isFavorite: false,
            },
          },
        },
      })
    },
  })

  return result.data.lmsMutation.deletefavouritecourse
}

const addCoursereview = async (courseId, type, rating) => {
  await defaultApolloClient.mutate({
    mutation: ADD_REVIEW,
    variables: {
      id: courseId,
      type,
      rating,
    },
  })
}

export {
  getCourseDetails,
  addCourseToFavourites,
  removeCourseFromFavourites,
  getAvailableCourses,
  getPopularCourses,
  getRecommendedCourses,
  fixStartCourse,
  addCoursereview,
  getCoursesWithName,
  getCompletedCourses,
  getStartedCourses,
}
