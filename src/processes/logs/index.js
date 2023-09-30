import { SAVE_LOG, SAVE_ERROR_LOG } from 'src/helpers/graphql/mutation/logs'

import defaultApolloClient from 'src/helpers/graphql/defaultApolloClient'

const saveLogs = async (log) => {
  await defaultApolloClient.mutate({
    mutation: SAVE_LOG,
    variables: {
      logData: log,
    },
  })
}

const saveErrorLogs = async (log) => {
  await defaultApolloClient.mutate({
    mutation: SAVE_ERROR_LOG,
    variables: {
      errorSource: log.errorMessage,
      errorName: log.errorName,
      errorMessage: log.errorMessage,
      callsChain: log.callsChain,
    },
  })
}

export { saveLogs, saveErrorLogs }
