
export interface Config {
  bccNodeConfigPath: string,
  db: {
    database: string,
    host: string,
    password: string,
    port: number
    user: string,
  },
  hasuraCliPath: string,
  hasuraUri: string,
  metadataServerUri: string,
  metadataUpdateInterval?: {
    assets: number
  },
  ogmios?: {
    host?: string
    port?: number
  },
  pollingInterval: {
    bccSupply: number
  }
}
