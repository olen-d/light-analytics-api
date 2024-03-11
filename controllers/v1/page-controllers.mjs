'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import {
  getPagesByTotalTimeViews,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalViews,
  newPage
} from '../../models/v1/page-models.mjs'

async function addPage (req, reply) {
  try {
    const { _db } = this
    const { body } = req
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

async function readPagesByTotalTimeViews (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getPagesByTotalTimeViews(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Pages by Total Views ${error}`)
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

async function readRoutesByTotalTimeViews (req, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getRoutesByTotalTimeViews(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Read Routes by Total Time Views ${error}`)
  }
}

async function readRoutesByTotalViews (req, reply) {
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
  readPagesByTotalTimeViews,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews
}
