import {
  acquireRoutesByBounceRate,
  acquireRoutesByTimePerView,
  acquireRouteComponentsByTotalTime,
  acquireRouteComponentsByTotalViews,
  acquireRouteSummary,
  acquireViewsCountTotalByHour,
  addPage,
  readContentSummaryByRoute,
  readRoutesBySinglePageSessions,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalUniqueViews,
  readRoutesByTotalViews,
  readTimeOnPageAverage,
  readTimePerPageview,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readViewsCountTotalByMonth,
  readViewsPerVisit,
} from '../../../../controllers/v1/page-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeTotal)
  fastify.get('/single-page', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesBySinglePageSessions)
  fastify.get('/by-day', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTimeByDay)
  fastify.get('/by-hour', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireViewsCountTotalByHour)
  fastify.get('/by-month', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountTotalByMonth)
  fastify.get('/entry', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountEntry)
  fastify.get('/exit', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsCountExit)
  fastify.get('/route/summary', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireRouteSummary)
  fastify.get('/routes/bounce-rate', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireRoutesByBounceRate)
  fastify.get('/routes/time/per-view', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireRoutesByTimePerView)
  fastify.get('/routes/total-time', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTime)
  fastify.get('/routes/total-time-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalTimeViews)
  fastify.get('/routes/total-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalViews)
  fastify.get('/routes/total-unique-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readRoutesByTotalUniqueViews)
  fastify.get('/routes/components/total-time', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireRouteComponentsByTotalTime)
  fastify.get('/routes/components/total-views', { onRequest: fastify.auth([fastify.verifyAPIKey])}, acquireRouteComponentsByTotalViews)
  fastify.get('/summary/by-route', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readContentSummaryByRoute)
  fastify.get('/time-on-pages/average', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readTimeOnPageAverage)
  fastify.get('/time/per-view', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readTimePerPageview)
  fastify.get('/views/per-visit', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readViewsPerVisit)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addPage)
}
