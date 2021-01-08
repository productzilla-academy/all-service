const { compile } = require('nexe')

compile({
  input: './dist/bin/app.js',
  output: './.bin/core-service',
  resources: [
    'package.json',
    './dist/handler/rest/docs/swagger.json',
    './config/custom-environment-variables.json',
    './default.json',
    './dist/lib/storage/drivers/sql/migrations/*.js', 
    'node_modules/knex/lib/dialects/mysql/index.js',
    'node_modules/knex/lib/dialects/postgres/index.js',
    'node_modules/knex/lib/dialects/mssql/index.js',
    'node_modules/knex/lib/dialects/oracle/index.js',
    'node_modules/calorette',
    'node_modules/uuid'
  ],
  targets: {
    platform: process.env.NEXE_PLATFORM,
    arch: process.env.NEXE_ARCH,
    version: process.env.NEXE_VERSION || '12.9.1'
  },
  temp: '.nexe'

}).then(() => {
  console.log('success') // eslint-disable-line no-console
}).catch((err) => {
  console.log(err) // eslint-disable-line no-console
})
