import { AVAILABLE_FILTERS } from 'src/helpers/graphql/query/filters'

import defaultApolloClient from 'src/helpers/graphql/defaultApolloClient'

const getAvailableFilters = async () => {
  const availableFilters = await defaultApolloClient.query({
    query: AVAILABLE_FILTERS,
  })

  return availableFilters.data.lms.availableFilters
}

export { getAvailableFilters }
