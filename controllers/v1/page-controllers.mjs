'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import {
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTimeTotal,
  getViewsCountTotalByMonth,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalViews,
  newPage
} from '../../models/v1/page-models.mjs'

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

async function readViewsCountTimeTotal (req, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getViewsCountTimeTotal(_db, info)
    reply.send(result)
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

export {
  addPage,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readViewsCountTotalByMonth,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews
}
