import gql from 'graphql-tag'

const SAVE_LOG = gql`
  mutation ($logData: String) {
    lmsMutation {
      saveLog(logData: $logData)
    }
  }
`

const SAVE_ERROR_LOG = gql`
  mutation (
    $errorSource: String
    $errorName: String
    $errorMessage: String
    $callsChain: String
  ) {
    lmsMutation {
      writeErrorToLog(
        errorSource: $errorSource
        errorName: $errorName
        errorMessage: $errorMessage
        callsChain: $callsChain
      )
    }
  }
`

export { SAVE_LOG, SAVE_ERROR_LOG }
