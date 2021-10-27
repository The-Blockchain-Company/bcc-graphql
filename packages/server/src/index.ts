import { createLogger } from 'bunyan'
import { Point } from '@bcc-ogmios/schema'
import { getConfig } from './config'
import {
  AurumGenesis,
  buildSchema as buildBccDbHasuraSchema,
  ColeGenesis,
  BccNodeClient,
  ChainFollower,
  Db,
  Genesis,
  HasuraClient,
  MetadataClient, SophieGenesis,
  Worker
} from '@bcc-graphql/api-bcc-db-hasura'
import { errors } from '@bcc-graphql/util'
import onDeath from 'death'
import { GraphQLSchema } from 'graphql'
import path from 'path'
import { Logger } from 'ts-log'
import { Server } from './Server'

export * from './config'

(async function () {
  const config = await getConfig()
  const logger: Logger = createLogger({
    name: 'bcc-graphql',
    level: config.loggerMinSeverity
  })
  try {
    const loadGenesis = (eraName: string) =>
      require(
        path.resolve(
          path.dirname(config.bccNodeConfigPath),
          bccNodeConfig[`${eraName}GenesisFile`]
        )
      )

    const schemas: GraphQLSchema[] = []
    const bccNodeConfig = require(config.bccNodeConfigPath)
    const genesis: Genesis = {
      aurum : loadGenesis('Aurum') as AurumGenesis,
      cole: loadGenesis('Cole') as ColeGenesis,
      sophie: loadGenesis('Sophie') as SophieGenesis
    }
    const lastConfiguredMajorVersion = require(config.bccNodeConfigPath)['LastKnownBlockVersion-Major']

    const bccNodeClient = new BccNodeClient(
      lastConfiguredMajorVersion,
      logger
    )
    const hasuraClient = new HasuraClient(
      config.hasuraCliPath,
      config.hasuraUri,
      config.pollingInterval.bccSupply,
      lastConfiguredMajorVersion,
      logger
    )
    const db = new Db(config.db, logger)
    const chainFollower = new ChainFollower(
      hasuraClient,
      logger,
      config.db
    )
    const metadataClient = new MetadataClient(
      config.metadataServerUri
    )
    const worker = new Worker(
      hasuraClient,
      logger,
      metadataClient,
      config.db,
      {
        metadataUpdateInterval: {
          assets: config.metadataUpdateInterval?.assets
        }
      }
    )
    const server = new Server(schemas, config, logger)
    schemas.push(await buildBccDbHasuraSchema(hasuraClient, genesis, bccNodeClient))
    await db.init({
      onDbInit: async () => {
        await Promise.all([
          hasuraClient.shutdown,
          bccNodeClient.shutdown,
          worker.shutdown,
          chainFollower.shutdown
        ])
        await server.shutdown()
      },
      onDbSetup: async () => {
        try {
          await server.init()
          await hasuraClient.initialize()
          await bccNodeClient.initialize(config.ogmios)
          await metadataClient.initialize()
          await chainFollower.initialize(config.ogmios)
          const mostRecentPoint = await hasuraClient.getMostRecentPointWithNewAsset()
          const points: Point[] = mostRecentPoint !== null ? [mostRecentPoint, 'origin'] : ['origin']
          await worker.start()
          await chainFollower.start(points)
          await server.start()
        } catch (error) {
          logger.error(error.message)
          if (error instanceof errors.HostDoesNotExist) {
            process.exit(1)
          }
        }
      }
    })
    onDeath(async () => {
      await Promise.all([
        hasuraClient.shutdown,
        bccNodeClient.shutdown,
        worker.shutdown,
        chainFollower.shutdown
      ])
      await db.shutdown()
      await server.shutdown()
      process.exit(1)
    })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
})()
