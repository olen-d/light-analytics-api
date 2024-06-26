'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import {
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTimeTotal,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalViews,
  newPage
} from '../../models/v1/page-models.mjs'

async function addPage (request, reply) {
  try {
    const { _db } = this
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
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews
}
