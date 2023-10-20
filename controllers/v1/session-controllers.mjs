'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import { getSinglePageSessionsCountTotal, getVisitsCountTotal, getVisitsCountUnique, newSession } from '../../models/v1/session-models.mjs'

async function addSession (request, reply) {
  try {
    const { _db } = this
    const { body, ip, headers } = request
    const clientIp = headers['x-real-ip'] ? headers['x-real-ip'] : ip
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)
  
    const {
      device,
      exitPage,
      landingPage,
      language,
      latency,
      pageLoad,
      sessionEndTime,
      sessionId,
      sessionStartTime,
      timezone,
      userAgent
    } = sanitized

  
    const info = {
      clientIp,
      device,
      exitPage,
      landingPage,
      language,
      latency,
      pageLoad,
      sessionEndTime,
      sessionId,
      sessionStartTime,
      timezone,
      userAgent
    }

    const result = await newSession(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Add Session ${error}`)
  }
}

async function readBounceRateTotal (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const resultSinglePage = await getSinglePageSessionsCountTotal(_db, info)
    const resultVisits = await getVisitsCountTotal(_db, info)

    const { data: { totalSinglePageSessions }, } = resultSinglePage
    const { data: { totalVisits} , } = resultVisits

    const bounceRate = totalSinglePageSessions / totalVisits

    reply.send({ 'status': 'ok' , 'data': { bounceRate }})
  } catch (error) {
    throw new Error(`Session Controllers Read Bounce Rate Total ${error}`)
  }
}

async function readSinglePageSessionsCountTotal (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getSinglePageSessionsCountTotal(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Single Page Sessions Count Total ${error}`)
  }
}

async function readVisitsCountTotal (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getVisitsCountTotal(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Total ${error}`)
  }
}

async function readVisitsCountUnique (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getVisitsCountUnique(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Unique ${error}`)
  }
}

export {
  addSession,
  readBounceRateTotal,
  readSinglePageSessionsCountTotal,
  readVisitsCountTotal,
  readVisitsCountUnique
}
