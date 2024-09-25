'use strict'
import {
  addPage,
  readBounceRateByRoute,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readViewsCountTotalByMonth,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews,
  readRoutesByTotalUniqueViews
} from '../../../../controllers/v1/page-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeTotal)
  fastify.get('/bounce-rate', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readBounceRateByRoute)
  fastify.get('/by-day', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeByDay)
  fastify.get('/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTotalByMonth)
  fastify.get('/entry', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountEntry)
  fastify.get('/exit', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountExit)
  fastify.get('/routes/total-time', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTime)
  fastify.get('/routes/total-time-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTimeViews)
  fastify.get('/routes/total-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalViews)
  fastify.get('/routes/total-unique-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalUniqueViews)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addPage)
}
