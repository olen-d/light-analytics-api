'use strict'
import { addPage, readRoutesByTotalTime, readRoutesByTotalTimeViews, readRoutesByTotalViews } from '../../../../controllers/v1/page-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'pages'
  })
  fastify.get('/routes/total-time', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTime)
  fastify.get('/routes/total-time-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTimeViews)
  fastify.get('/routes/total-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalViews)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addPage)
}
