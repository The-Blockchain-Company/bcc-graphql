module.exports = function () {
  return {
    files: [
      'packages/api-bcc-db-hasura/src/**/*.ts',
      'packages/api-bcc-db-hasura/**/*.graphql',
      '!packages/api-bcc-db-hasura/src/**/*.test.ts'
    ],
    tests: [
      'packages/api-bcc-db-hasura/src/**/*.test.ts'
    ],
    env: {
      params: {
        env: 'TEST_MODE=integration'
      },
      type: 'node'
    },
    workers: {
      restart: true
    },
    testFramework: 'jest'
  }
}
