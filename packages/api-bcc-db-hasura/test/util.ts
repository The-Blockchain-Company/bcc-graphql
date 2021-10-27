import utilDev from '@bcc-graphql/util-dev'
// import { buildSchema } from '@src/executableSchema'
// import { Db } from '@src/Db'
import pRetry from 'p-retry'
import { gql } from 'apollo-boost'
import util from '@bcc-graphql/util'
// import { HasuraClient } from '@src/HasuraClient'
// import path from 'path'
// import { readSecrets } from '@src/util'
// import { Config } from '@src/Config'
// import { Genesis } from '@src/graphql_types'
// import { BccNodeClient } from '@src/BccNodeClient'

// const getLastConfiguredMajorVersion = (network: string) =>
//   require(`../../../config/network/${network}/bcc-node/config.json`)['LastKnownBlockVersion-Major']

export const testClient = {
  mainnet: buildClient.bind(this,
    'http://localhost:3100'
    // 'http://localhost:8090',
    // 5442,
    // {
    //   cole: require('../../../config/network/mainnet/genesis/cole.json'),
    //   sophie: require('../../../config/network/mainnet/genesis/sophie.json')
    // }
  ),
  aurum Qa: buildClient.bind(this,
    'http://localhost:3102'
    // 'http://localhost:8092',
    // 5444,
    // {
    //   cole: require('../../../config/network/aurum -qa/genesis/cole.json'),
    //   sophie: require('../../../config/network/aurum -qa/genesis/sophie.json')
    // }
  )
}

export async function buildClient (
  apiUri: string
  // hasuraUri: Config['hasuraUri'],
  // dbPort: Config['db']['port'],
  // genesis: Genesis,
  // lastConfiguredMajorVersion: number
) {
  // if (process.env.TEST_MODE !== 'integration') {
  const client = await utilDev.createE2EClient(apiUri)
  await pRetry(async () => {
    const result = await client.query({
      query: gql`query {
            bccDbMeta {
                initialized
            }}`
    })
    if (result.data?.bccDbMeta.initialized === false) {
      throw new Error(`Bcc DB is not initialized: ${JSON.stringify(result.data)}`)
    }
  }, {
    factor: 1.75,
    retries: 9,
    onFailedAttempt: util.onFailedAttemptFor('Bcc GraphQL Server readiness')
  })
  return client
  // } else {
  //   const bccNodeClient = new BccNodeClient(
  //     genesis.sophie.protocolParams.protocolVersion.major
  //   )
  //   const hasuraClient = new HasuraClient('hasura', hasuraUri, 1000 * 60 * 5, lastConfiguredMajorVersion)
  //   const db = new Db({
  //     ...{ host: 'localhost', port: dbPort },
  //     ...await readSecrets(path.resolve(__dirname, '..', '..', '..', 'config', 'secrets'))
  //   })
  //   await db.init({
  //     onDbSetup: hasuraClient.applySchemaAndMetadata.bind(hasuraClient)
  //   })
  //   const schema = await buildSchema(hasuraClient, genesis, bccNodeClient)
  //   return utilDev.createIntegrationClient(schema)
  // }
}
