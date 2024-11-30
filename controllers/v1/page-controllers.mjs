'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import {
  getRoutesBySinglePageSessions,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalUniqueViews,
  getRoutesByTotalViews,
  getSessionsTotal,
  getTimeOnPageTotal,
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTotalByMonth,
  getViewsCountTimeTotal,
  newPage
} from '../../models/v1/page-models.mjs'

import { formatUTCDate, getPreviousPeriodDates } from '../../services/v1/date-services.mjs'
import { readViewsFirstTime, readViewsLastTime } from '../../services/v1/page-services.mjs'

// Helper Functions
const filterQueryString = (getSetting, route) => {
  if (route.indexOf('?') !== -1) {
    const excludedURLQueryParameters = getSetting('excludedURLQueryParameters')
    if (excludedURLQueryParameters) {
      const parameters = excludedURLQueryParameters.split(',')
      const [path, queryParameters] = route.split('?')
      if (queryParameters.indexOf('&') !== -1) {
        const queryParametersList = queryParameters.split('&')

        const filteredQueryParametersList = queryParametersList.filter(queryParameter => {
          const matches = matchExcludedURLQueryParameters(parameters, queryParameter)
          return !matches.length > 0
        })
        const filteredRoute = filteredQueryParametersList.length > 0 ? `${path}?${filteredQueryParametersList.join('&')}` : path
        return filteredRoute
      } else {
        const matches = matchExcludedURLQueryParameters(parameters, queryParameters)
        const filteredRoute = matches.length === 0 ? `${path}?${queryParameters}` : path
        return filteredRoute
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

const matchExcludedURLQueryParameters = (parameters, queryParameter) => {
  const matches = parameters.filter(parameter => {
    const regex = new RegExp(`${parameter}=`, 'i')
    const test = regex.test(queryParameter)
    return test
  })
  return matches
}

async function addPage (request, reply) {
  try {
    const { _db, getSetting } = this
    const { body } = request
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)

    const {
      pageName,
      pageStartTime,
      route,
      sessionId,
      timeOnPage
    } = sanitized

  
    const info = {
      pageName,
      pageStartTime,
      route,
      sessionId,
      timeOnPage
    }
  
    const newRoute = filterQueryString(getSetting, route)
    if (newRoute) { info.route = newRoute }

    const result = await newPage(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Add Page ${error}`)
  }
}

async function readRoutesBySinglePageSessions (request, reply) {
  const { _db } = this

  let info = null
  if (Object.keys(request.query).length === 0) {
    info = 'all'
  } else {
    // Deal with custom info
  }

  try {
    const result = await getRoutesBySinglePageSessions(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes By Single Page Sessions ${error}`)
  }
}

async function readContentSummaryByRoute (request, reply) {
  const { _db } = this
  const infoModern = 'all'
  const info = {}
  info.all = true

  try {
    const resultTotal = await getRoutesByTotalTimeViews(_db, info)
    const resultUnique = await getRoutesByTotalUniqueViews(_db, infoModern)
    const resultEntry = await getViewsCountEntry(_db, info)
    const resultExit = await getViewsCountExit(_db, info)
    const resultSinglePage = await getRoutesBySinglePageSessions(_db, infoModern)

    const { data: uniqueViewsByRoute } = resultUnique
    const { data: entryPagesCount } = resultEntry
    const { data: exitPagesCount} = resultExit
    const { data: singlePageSessions } = resultSinglePage

    const contentSummaryByRoute = resultTotal.data.map(item => {
      const { route, 'total_views': totalViews, 'total_time': totalTime } = item
      const averageTimeOnPage = Math.round(totalTime / totalViews)

      const indexTUVBR = uniqueViewsByRoute.findIndex(element => element.route === item.route)
      const indexENPC = entryPagesCount.findIndex(element => element['entry_page'] === item.route)
      const indexEXPC = exitPagesCount.findIndex(element => element['exit_page'] === item.route)
      const indexSPS = singlePageSessions.findIndex(element => element.route === item.route)

      const tuvbr = indexTUVBR === -1 ? 0 : uniqueViewsByRoute[indexTUVBR]['total_unique_views']
      const enpc = indexENPC === -1 ? 0 : entryPagesCount[indexENPC]['entry_page_count']
      const expc = indexEXPC === -1 ? 0 : exitPagesCount[indexEXPC]['exit_page_count']
      const sps = indexSPS === -1 ? 0 : singlePageSessions[indexSPS]['single_page_sessions']

      const bounceRate = sps / totalViews

      return({
        route,
        totalViews,
        uniquePageViews: tuvbr,
        averageTimeOnPage,
        entrances: enpc,
        exits: expc,
        bounceRate
      })
    })
    const status = 'ok'
    reply.send({ status, data: { contentSummaryByRoute } })
  } catch(error) {
    throw new Error(`Page Controllers Read Content Summary By Route ${error}`)
  }

  // Get Total Time and Page Views
  // Get Unique Page Views
  // Get Entries
  // Get Exits
  // Get Bounce Rate
  // Calculate Average Time on Page and Add it to the Array
  // Summary by Route { route, page_views, unique_page_views, average_time_on_page, entrances, exits, bounce_rate }
}

async function readTimeOnPageAverage (request, reply) {
  const {_db } = this

  try {
    if (Object.keys(request.query).length === 0) {
      const info = 'all'
      const endDate = await readViewsLastTime(_db, info)
      const startDate = await readViewsFirstTime(_db, info)
      const resultTimeTotal = await getTimeOnPageTotal(_db, info)
      const resultSessionsTotal = await getSessionsTotal(_db, info)

      const { data: [{ 'total_time': totalTime }] } = resultTimeTotal
      const { data: [{ 'total_sessions': totalSessions }] } = resultSessionsTotal

      const timeOnPageAverage = totalTime / totalSessions

      const data = {
        timeOnPageAverage,
        startDate,
        endDate,
        timeOnPageAveragePrev: null,
        timeOnPageAverageChange: null
      }

      const status = 'ok'

      reply.send({ status, data })
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      const info = { type: 'dates', endDate, startDate }

      const resultTimeTotal = await getTimeOnPageTotal(_db, info)
      const resultSessionsTotal = await getSessionsTotal(_db, info)

      const { data: [{ 'total_time': totalTime }] } = resultTimeTotal
      const { data: [{ 'total_sessions': totalSessions }] } = resultSessionsTotal

      const timeOnPageAverage = totalTime / totalSessions

      const { endDatePrevJs, startDatePrevJs } = getPreviousPeriodDates(startDate, endDate)

      const endDatePrev = formatUTCDate(endDatePrevJs,'mySQLDate')
      const startDatePrev = formatUTCDate(startDatePrevJs,'mySQLDate')

      const prevInfo = { type: 'dates', 'endDate': endDatePrev, 'startDate': startDatePrev }
      const prevResultTimeTotal = await getTimeOnPageTotal(_db, prevInfo)
      const prevResultSessionsTotal = await getSessionsTotal(_db, prevInfo)

      const { data: [{ 'total_time': totalTimePrev }] } = prevResultTimeTotal
      const { data: [{ 'total_sessions': totalSessionsPrev }] } = prevResultSessionsTotal

      const timeOnPageAveragePrev = totalTimePrev / totalSessionsPrev
      const timeOnPageAverageChange = ( timeOnPageAverage - timeOnPageAveragePrev ) / timeOnPageAveragePrev

      const data = {
        timeOnPageAverage,
        startDate,
        endDate,
        timeOnPageAveragePrev,
        timeOnPageAverageChange
      }

      const status = 'ok'

      reply.send({ status, data })
    }
  } catch (error) {
    throw new Error(`Page Controllers Read Time On Page Average ${error}`)
  }
}

async function readTimePerPageview (request, reply) {
  const { _db } = this

  let info = null

  if (Object.keys(request.query).length === 0) {
    info = 'all'
  } else {
    const { query: { enddate: endDate, startdate: startDate }, } = request
    info = { type: 'dates', endDate, startDate }
  }

  try {
    const result = await getViewsCountTimeTotal(_db, info)

    const { data: { totalTime, totalViews, startDate, endDate }, } = result

    const timePerPageview = totalTime / totalViews

    reply.send({
      'status': 'ok',
      'data': {
        timePerPageview,
        startDate,
        endDate
      }
    })
  } catch (error) {
    throw new Error(`Page Controllers Read Time Per Pageview ${error}`)
  }
}

async function readViewsCountEntry (request, reply) {
  try{
    const { _db } = this

    const info = {}
    if (Object.keys(request.query).length === 0) {
      info.all = true
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request

      info.endDate = endDate || false
      info.startDate = startDate || false
    }

    const result = await getViewsCountEntry(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Views Count Entry ${error}`)
  }
}

async function readViewsCountExit (request, reply) {
  try{
    const { _db } = this

    const info = {}
    if (Object.keys(request.query).length === 0) {
      info.all = true
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request

      info.endDate = endDate || false
      info.startDate = startDate || false
    }

    const result = await getViewsCountExit(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Views Count Exit ${error}`)
  }
}

async function readViewsCountTimeByDay (request, reply) {
  try {
    const { _db } = this

    let info = null
  
    if (Object.keys(request.query).length === 0) {
      info = 'all'
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      info = { type: 'dates', endDate, startDate }
    }

    const result = await getViewsCountTimeByDay(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Views Count Time By Day ${error}`)
  }
}

async function readViewsCountTimeTotal (request, reply) {
  try {
    const { _db } = this

    if (Object.keys(request.query).length === 0) {
      const info = 'all'
      const endDate = await readViewsLastTime(_db, info)
      const startDate = await readViewsFirstTime(_db, info)
      const result = await getViewsCountTimeTotal(_db, info)

      const { status, data: { totalTime, totalViews }, } = result

      const data = {
        totalTime,
        totalViews,
        startDate,
        endDate,
        totalTimePrev: null,
        totalTimeChange: null,
        totalViewsPrev: null,
        totalViewsChange: null
      }

      reply.send({ status, data })
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      const info = { type: 'dates', endDate, startDate }

      const result = await getViewsCountTimeTotal(_db, info)

      const { status, data: { totalTime, totalViews }, } = result

      const { endDatePrevJs, startDatePrevJs } = getPreviousPeriodDates(startDate, endDate)

      const endDatePrev = formatUTCDate(endDatePrevJs,'mySQLDate')
      const startDatePrev = formatUTCDate(startDatePrevJs,'mySQLDate')

      const prevInfo = { type: 'dates', 'endDate': endDatePrev, 'startDate': startDatePrev }
      const prevResult = await getViewsCountTimeTotal(_db, prevInfo)

      const { data: { totalTime: totalTimePrev, totalViews: totalViewsPrev }, } = prevResult

      const totalTimeChange = ( totalTime - totalTimePrev ) / totalTimePrev
      const totalViewsChange = ( totalViews - totalViewsPrev ) / totalViewsPrev

      const data = {
        totalTime,
        totalViews,
        startDate,
        endDate,
        totalTimePrev,
        totalTimeChange,
        totalViewsPrev,
        totalViewsChange
      }

      reply.send({ status, data })
    }
  } catch (error) {
    throw new Error(`Page Controllers Read Views Count Total Time ${error}`)
  }
}

async function readViewsCountTotalByMonth (req, reply) {
  const { _db } = this
  const info = 'all'

  try {
    const result = await getViewsCountTotalByMonth(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Views Count Total By Month ${error}`)
  }
}

async function readViewsPerVisit (request, reply) {
  try {
    const { _db } = this

    let info = null
  
    if (Object.keys(request.query).length === 0) {
      info = 'all'
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      info = { type: 'dates', endDate, startDate }
    }

    const resultSessionsTotal = await getSessionsTotal(_db, info)
    const resultViews = await getViewsCountTimeTotal(_db, info)

    const { data: { totalViews, startDate, endDate }, } = resultViews
    const { data: [{ 'total_sessions': totalSessions }] } = resultSessionsTotal

    const viewsPerVisit = totalViews / totalSessions

    reply.send({
      'status': 'ok',
      'data': {
        viewsPerVisit,
        startDate,
        endDate
      }
    })
  } catch (error) {
    throw new Error(`Page Controllers Read Views Per Visit ${error}`)
  }
}

async function readRoutesByTotalTime (req, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getRoutesByTotalTime(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes by Total Time ${error}`)
  }
}

async function readRoutesByTotalTimeViews (request, reply) {
  try {
    const { _db } = this

    const info = {}
    if (Object.keys(request.query).length === 0) {
      info.all = true
    } else {
      const { query: { enddate: endDate, levels, startdate: startDate }, } = request

      info.endDate = endDate || false
      info.levels = levels || false
      info.startDate = startDate || false
    }
    const result = await getRoutesByTotalTimeViews(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes by Total Time Views ${error}`)
  }
}

async function readRoutesByTotalViews (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getRoutesByTotalViews(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes by Total Views ${error}`)
  }
}

async function readRoutesByTotalUniqueViews (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getRoutesByTotalUniqueViews(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes by Unique Views ${error}`)
  }
}

export {
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
  readViewsPerVisit
}
