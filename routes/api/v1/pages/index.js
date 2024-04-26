'use strict'
import {
  addPage,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews
} from '../../../../controllers/v1/page-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeTotal)
  fastify.get('/by-day', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeByDay)
  fastify.get('/entry', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountEntry)
  fastify.get('/exit', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountExit)
  fastify.get('/routes/total-time', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTime)
  fastify.get('/routes/total-time-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTimeViews)
  fastify.get('/routes/total-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalViews)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addPage)
}
