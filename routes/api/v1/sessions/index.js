'use strict'
import { addSession } from '../../../../controllers/v1/session-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'sessions'
  })
  fastify.get('/taco-flavor', async function (request, reply) {
    return 'doritos'
  })
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addSession)
}
