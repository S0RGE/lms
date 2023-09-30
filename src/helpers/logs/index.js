import { SAVE_LOG } from 'src/helpers/graphql/mutation/logs'

import { useMutation } from '@vue/apollo-composable'

const saveLog = (logData) => {
  const { mutate: saveLogData } = useMutation(SAVE_LOG, {
    variables: { logData },
  })

  saveLogData()
}

export { saveLog }
