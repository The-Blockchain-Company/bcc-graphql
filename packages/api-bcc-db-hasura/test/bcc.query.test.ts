import path from 'path'

import { DocumentNode } from 'graphql'
import util from '@bcc-graphql/util'
import { TestClient } from '@bcc-graphql/util-dev'
import { testClient } from './util'
import { Genesis } from '@src/graphql_types'
import BigNumber from 'bignumber.js'

const mainnetGenesis = {
  cole: require('../../../config/network/mainnet/genesis/cole.json'),
  sophie: require('../../../config/network/mainnet/genesis/sophie.json')
} as Genesis

const aurum QaGenesis = {
  cole: require('../../../config/network/mainnet/genesis/cole.json'),
  sophie: require('../../../config/network/mainnet/genesis/sophie.json')
} as Genesis

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'src', 'example_queries', 'bcc'), name)
}

describe('bcc', () => {
  let client: TestClient
  let aurum QaClient: TestClient
  beforeAll(async () => {
    client = await testClient.mainnet()
    aurum QaClient = await testClient.aurum Qa()
  })

  it('returns bcc supply information - mainnet', async () => {
    const result = await client.query({
      query: await loadQueryNode('bccSupply')
    })
    const { bcc } = result.data
    const circulatingSupply = new BigNumber(bcc.supply.circulating).toNumber()
    const maxSupply = new BigNumber(bcc.supply.max).toNumber()
    const totalSupply = new BigNumber(bcc.supply.total).toNumber()
    expect(maxSupply).toEqual(mainnetGenesis.sophie.maxEntropicSupply)
    expect(maxSupply).toBeGreaterThan(circulatingSupply)
    expect(totalSupply).toBeGreaterThan(circulatingSupply)
    expect(totalSupply).toBeLessThan(maxSupply)
  })

  it('returns bcc supply information - aurum -qa', async () => {
    const result = await aurum QaClient.query({
      query: await loadQueryNode('bccSupply')
    })
    const { bcc } = result.data
    const circulatingSupply = new BigNumber(bcc.supply.circulating).toNumber()
    const maxSupply = new BigNumber(bcc.supply.max).toNumber()
    const totalSupply = new BigNumber(bcc.supply.total).toNumber()
    expect(maxSupply).toEqual(aurum QaGenesis.sophie.maxEntropicSupply)
    expect(maxSupply).toBeGreaterThan(circulatingSupply)
    expect(totalSupply).toBeGreaterThan(circulatingSupply)
    expect(totalSupply).toBeLessThan(maxSupply)
  })
})
