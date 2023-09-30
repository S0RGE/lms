import gql from 'graphql-tag'

const AVAILABLE_FILTERS = gql`
  query {
    lms {
      availableFilters {
        categories {
          name
          code
          parentcode
        }
        levels {
          name
          code
        }
        products {
          name
          code
        }
        roles {
          name
          code
        }
        eRRORCODE
        eRRORMESSAGE
        sUCCESS
        sUCCESSMESSAGE
      }
    }
  }
`

export { AVAILABLE_FILTERS}