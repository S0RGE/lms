import { LESSON_CONTENT } from 'src/helpers/graphql/query/lessons'
import {
  FIX_LESSON_PASSING,
  ADD_POST,
} from 'src/helpers/graphql/mutation/lessons'

// import { COURSE_DETAILS } from 'src/helpers/graphql/query/courses'

import { saveLogs, saveErrorLogs } from 'src/processes/logs'

import defaultApolloClient from 'src/helpers/graphql/defaultApolloClient'

const getLessonContent = async (lessonGuid, courseId, isFree = false) => {
  const result = await defaultApolloClient
    .query({
      query: LESSON_CONTENT,
      variables: {
        lessonGuid,
        courseId,
        isFree,
      },
    })
    .then((res) => res.data.lms.lessonContent)
    .catch((error) => {
      const logData = {
        errorSource: 'Get lesson content method',
        errorName: 'Failed get lesson content',
        errorMessage: JSON.stringify(error),
        callsChain: '',
      }

      saveErrorLogs(logData)
    })

  return result
}

const fixLessonPassing = async (lessonGuid, courseGuid) => {
  try {
    await defaultApolloClient.mutate({
      mutation: FIX_LESSON_PASSING,
      variables: {
        lessonGuid,
        courseGuid,
        status: '+',
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
    const log = JSON.stringify({
      pageName: 'page',
      eventName: 'fix start course',
      eventDate: new Date(),
      eventData: 'Course fails to start. Error: ' + JSON.stringify(e),
      ticket: '00000000-0000-0000-0000-000000000000',
    })

    saveErrorLogs(log)
  }
}

const addPost = async (param, post) => {
  const result = await defaultApolloClient.mutate({
    mutation: ADD_POST,
    variables: {
      param,
      post,
    },
  })
  return result
}

export { getLessonContent, fixLessonPassing, addPost }
