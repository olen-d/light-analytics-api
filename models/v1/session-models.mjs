'use strict'

import { createSession, readVisitsCountTotal, readVisitsCountUnique } from '../../services/v1/session-services.mjs'

const getVisitsCountTotal = async (_db, info) => {
  try {
    const result = await readVisitsCountTotal(_db, info)

    const status = result ? 'ok' : 'error'
    const data = status === 'ok' ? { 'totalVisits': result } : null

    return { status, data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total ${error}`)
  }
}

const getVisitsCountUnique = async (_db, info) => {
  try {
    const result = await readVisitsCountUnique(_db, info)

    const status = result ? 'ok' : 'error'
    const data = status === 'ok' ? { 'uniqueVisits': result } : null

    return { status, data }
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

export { getVisitsCountTotal, getVisitsCountUnique, newSession }
