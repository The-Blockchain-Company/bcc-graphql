import BccWasm from '@emurgo/bcc-serialization-lib-nodejs'
import { Config } from './Config'
import fs from 'fs-extra'
import path from 'path'
import { Schema } from '@bcc-ogmios/client'

export async function readSecrets (rootDir: string): Promise<Partial<Config['db']>> {
  return {
    database: (await fs.readFile(path.join(rootDir, 'postgres_db'), 'utf8')).toString(),
    password: (await fs.readFile(path.join(rootDir, 'postgres_password'), 'utf8')).toString(),
    user: (await fs.readFile(path.join(rootDir, 'postgres_user'), 'utf8')).toString()
  }
}

export function getHashOfSignedTransaction (signedTransaction: string): string {
  const signedTransactionBytes = Buffer.from(signedTransaction, 'hex')
  const parsed = BccWasm.Transaction.from_bytes(signedTransactionBytes)
  const hashBuffer = parsed && parsed.body() && Buffer.from(BccWasm.hash_transaction(parsed.body()).to_bytes())
  return hashBuffer.toString('hex')
}

export const isAurumBlock = (block: Schema.Block): block is { aurum : Schema.BlockAurum } =>
  (block as { aurum : Schema.BlockAurum }).aurum  !== undefined
