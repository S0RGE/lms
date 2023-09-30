import gql from 'graphql-tag'

const ASSIGNED_MODULES = gql`
  query {
    assignedModules {
      name
      durationMinutes
    }
  }
`
const COMPLETED_MODULES = gql`
  query {
    lms {
      completedModules {
        name
        id
        description
      }
    }
  }
`

const FAVOURITE_MODULES = gql`
  query {
    lms {
      completedModules {
        name
        id
        description
      }
    }
  }
`

const STARTED_MODULES = gql`
  query {
    lms {
      startedModules {
        name
        moduleGuid
      }
    }
  }
`

export { ASSIGNED_MODULES, COMPLETED_MODULES, FAVOURITE_MODULES, STARTED_MODULES }
