'use strict'

import {
  createSession,
  readSinglePageSessionsCountTotal,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountUnique
} from '../../services/v1/session-services.mjs'

const getSinglePageSessionsCountTotal = async (_db, info) => {
  try {
    const result = await readSinglePageSessionsCountTotal(_db, info)

    const data = { 'totalSinglePageSessions': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Single Page Sessions Count Total ${error}`)
  }
}

const getVisitsCountTotal = async (_db, info) => {
  try {
    const result = await readVisitsCountTotal(_db, info)

    const data =  { 'totalVisits': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total ${error}`)
  }
}

const getVisitsCountTotalByDay = async (_db, info) => {
  try {
    const result = await readVisitsCountTotalByDay(_db, info)

    const data =  { 'totalVisitsByDay': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total By Day ${error}`)
  }
}

const getVisitsCountUnique = async (_db, info) => {
  try {
    const result = await readVisitsCountUnique(_db, info)
    const data = { 'uniqueVisits': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Unique ${error}`)
  }
}

const newSession = async (_db, info) => {
  try {
    const result = await createSession(_db, info)
    const status = await result[0].affectedRows === 1 ? 'ok' : 'error'
    const data = status === 'ok' ? { insertId: result[0].insertId } : result

    return { status, data }
  } catch (error) {
    throw new Error(`Session Models New Session ${error}`)
  }
}

export {
  getSinglePageSessionsCountTotal,
  getVisitsCountTotal,
  getVisitsCountTotalByDay,
  getVisitsCountUnique,
  newSession
}
