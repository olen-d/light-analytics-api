'use strict'
import { addPage } from '../../../../controllers/v1/page-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'pages'
  })
  fastify.get('/cool-ranch', async function (request, reply) {
    return 'dressing'
  })
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addPage)
}
