import path from 'path'

import { DocumentNode } from 'graphql'
import util from '@bcc-graphql/util'
import { TestClient } from '@bcc-graphql/util-dev'
import { testClient } from './util'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'src', 'example_queries', 'bcc'), name)
}

describe('bcc', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.mainnet()
  })

  it('Returns core information about the current state of the network', async () => {
    const result = await client.query({
      query: await loadQueryNode('chainTipAndCurrentEpochNumber')
    })
    expect(result.data.bcc.tip.number).toBeGreaterThan(3994551)
    expect(result.data.bcc.currentEpoch.number).toBeGreaterThan(184)
  })
})
