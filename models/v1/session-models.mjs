import { v4 as uuidv4 } from 'uuid'

import {
  createSession,
  readLanguageCount,
  readReferrerCount,
  readSinglePageSessionsCountTotal,
  readSinglePageSessionsCountTotalByMonth,
  readStatisticDateRange,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountTotalByDayOfWeek,
  readVisitsCountTotalByHour,
  readVisitsCountTotalByMonth,
  readVisitsCountUnique,
  readVisitsCountUniqueByMonth,
} from '../../services/v1/session-services.mjs'

// Helper functions
// Useful for items that come back from the database without and Id, e.g. anything resulting from a GROUP BY
const addUniqueIds = data => {
  const dataWithUniqueIds = data.map(element => {
    return Object.assign({ id: uuidv4()}, element)
  })
  return dataWithUniqueIds
}

// Exports
const getLanguageCount = async (_db, info) => {
  try {
    const result = await readLanguageCount(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = { 'languages': resultWithUniqueIds }

    if (info === 'all')
      {
        const infoDateRange = { all: true, statistic: 'language' }
        const resultDateRange = await readStatisticDateRange(_db, infoDateRange)
    
        const referrerDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = referrerDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }
  } catch (error) {
    throw new Error(`Session Models Get Language Count ${error}`)
  }
}

const getReferrerCount = async (_db, info) => {
  try {
    const result = await readReferrerCount(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = { 'referrers': resultWithUniqueIds }

    if (info === 'all')
      {
        const infoDateRange = { all: true, statistic: 'referrer' }
        const resultDateRange = await readStatisticDateRange(_db, infoDateRange)
    
        const referrerDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = referrerDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }
  } catch (error) {
    throw new Error(`Session Models Get Referrer Count ${error}`)
  }
}

const getSinglePageSessionsCountTotal = async (_db, info) => {
  try {
    const result = await readSinglePageSessionsCountTotal(_db, info)

    const data = { 'totalSinglePageSessions': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Single Page Sessions Count Total ${error}`)
  }
}

const getSinglePageSessionsCountTotalByMonth = async (_db, info) => {
  try {
    const result = await readSinglePageSessionsCountTotalByMonth(_db, info)

    const data = { 'totalSinglePageSessionsByMonth': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Single Page Sessions Count Total By Month ${error}`)
  }
}

const getStatisticDateRange = async (_db, info) => {
  try {
    const result = await readStatisticDateRange(_db, info)

    return { 'status': 'ok', data: result }
  } catch (error) {
    throw new Error(`Session Models Get Statistic Date Range (${info.statistic}) ${error}`)
  }
}

const getVisitsCountTotal = async (_db, info) => {
  try {
    const result = await readVisitsCountTotal(_db, info)

    return { 'status': 'ok', 'totalVisits': result }
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

const getVisitsCountTotalByDayOfWeek = async (_db, info) => {
  try {
    const result = await readVisitsCountTotalByDayOfWeek(_db, info)

    const data = { 'totalVisitsByDayOfWeek': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total By Day Of Week ${error}`)
  }
}

const getVisitsCountTotalByHour = async (_db, info) => {
  try {
    const result = await readVisitsCountTotalByHour(_db, info)

    const data =  { 'totalVisitsByHour': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total By Hour ${error}`)
  }
}

const getVisitsCountTotalByMonth = async (_db, info) => {
  try {
    const result = await readVisitsCountTotalByMonth(_db, info)

    const data =  { 'totalVisitsByMonth': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Total By Month ${error}`)
  }
}

const getVisitsCountUnique = async (_db, info) => {
  try {
    const result = await readVisitsCountUnique(_db, info)

    return { 'status': 'ok', 'uniqueVisits': result }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Unique ${error}`)
  }
}

const getVisitsCountUniqueByMonth = async (_db, info) => {
  try {
    const result = await readVisitsCountUniqueByMonth(_db, info)
    const data = { 'totalUniqueVisitsByMonth': result }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Unique By Month ${error}`)
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
  getLanguageCount,
  getReferrerCount,
  getSinglePageSessionsCountTotal,
  getSinglePageSessionsCountTotalByMonth,
  getStatisticDateRange,
  getVisitsCountTotal,
  getVisitsCountTotalByDay,
  getVisitsCountTotalByDayOfWeek,
  getVisitsCountTotalByHour,
  getVisitsCountTotalByMonth,
  getVisitsCountUnique,
  getVisitsCountUniqueByMonth,
  newSession
}
