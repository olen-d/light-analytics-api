'use strict'
import { addSession, readVisitsCountTotal } from '../../../../controllers/v1/session-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotal)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addSession)
}
