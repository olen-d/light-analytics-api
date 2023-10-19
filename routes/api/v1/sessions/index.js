'use strict'
import { addSession, readSinglePageSessionsCountTotal, readVisitsCountTotal, readVisitsCountUnique } from '../../../../controllers/v1/session-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotal)
  fastify.get('/single-page', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readSinglePageSessionsCountTotal)
  fastify.get('/unique', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountUnique)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addSession)
}
