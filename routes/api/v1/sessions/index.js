'use strict'
import {
  addSession,
  readBounceRateTotal,
  readSinglePageSessionsCountTotal,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountTotalByMonth,
  readVisitsCountUnique
} from '../../../../controllers/v1/session-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotal)
  fastify.get('/bounce-rate', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readBounceRateTotal)
  fastify.get('/by-day', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotalByDay)
  fastify.get('/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotalByMonth)
  fastify.get('/single-page', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readSinglePageSessionsCountTotal)
  fastify.get('/unique', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountUnique)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addSession)
}
