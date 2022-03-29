import { Asset } from './graphql_types'
import AssetFingerprint from '@the-blockchain-company/cip14-js'

export const assetFingerprint = (policyId: Asset['policyId'], assetName?: Asset['assetName']) =>
  new AssetFingerprint(
    Buffer.from(policyId, 'hex'),
    Buffer.from(assetName ?? '', 'hex')
  ).fingerprint()
