'use strict'
import {
  acquireStatisticDateRange,
  acquireVisitsCountTotalByHour,
  addSession,
  readBounceRateTotal,
  readLanguagerCount,
  readReferrerCount,
  readSinglePageSessionsCountTotal,
  readSinglePageSessionsCountTotalByMonth,
  readSummaryByMonth,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  acquireVisitsCountTotalByDayOfWeek,
  readVisitsCountTotalByMonth,
  readVisitsCountUniqueByMonth,
  readVisitsCountUnique
} from '../../../../controllers/v1/session-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotal)
  fastify.get('/bounce-rate', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readBounceRateTotal)
  fastify.get('/by-day', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotalByDay)
  fastify.get('/by-day-of-week', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireVisitsCountTotalByDayOfWeek)
  fastify.get('/by-hour', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireVisitsCountTotalByHour)
  fastify.get('/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountTotalByMonth)
  fastify.get('/date-range', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireStatisticDateRange)
  fastify.get('/languages', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readLanguagerCount)
  fastify.get('/referrers', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readReferrerCount)
  fastify.get('/single-page', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readSinglePageSessionsCountTotal)
  fastify.get('/single-page/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readSinglePageSessionsCountTotalByMonth)
  fastify.get('/summary/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readSummaryByMonth)
  fastify.get('/unique', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountUnique)
  fastify.get('/unique/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readVisitsCountUniqueByMonth)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addSession)
}
