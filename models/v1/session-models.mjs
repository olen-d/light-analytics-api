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

import { addUniqueIds } from '../../services/v1/aggregation-services.mjs'
import { getDateParts, getDaysBetween } from '../../services/v1/date-services.mjs'

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
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info === 'all')
      {
        const infoDateRange = { all: true, statistic: 'session_id' }
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
    throw new Error(`Session Models Get Visits Count Total By Day Of Week ${error}`)
  }
}

const getVisitsCountAverageByDayOfWeek = async (_db, info) => {
  try {
    const result = await readVisitsCountTotalByDayOfWeek(_db, info)

    if (info === 'all')
      {
        const infoDateRange = { all: true, statistic: 'session_id' }
        const resultDateRange = await readStatisticDateRange(_db, infoDateRange)
    
        const referrerDateRange = resultDateRange.map(element => {
          return element['created_at'] + ''
        })

        const [startDateJs, endDateJs] = referrerDateRange  // Remember mysql2 returns a JavaScript date string from date time fields

        if (result?.length > 0) {
          const totalDays = getDaysBetween(startDateJs, endDateJs, 'dateString')
          const minNumberOfWeekdays = Math.floor(totalDays / 7)
          const weekdaysOverMinimum = totalDays % 7
        
          const weekdays = Array(6)
          if (weekdaysOverMinimum === 0) {
            weekdays.fill(minNumberOfWeekdays)
          } else {
            const [startDateYear, startDateMonth, startDateDay] = getDateParts(startDateJs, 'dateString')
            const startDateObj = new Date(startDateYear, startDateMonth, startDateDay)
            const firstDayOfWeek = startDateObj.getDay()

            for (let i = 0; i < 7; i++) {
              const days = i < firstDayOfWeek ? minNumberOfWeekdays : minNumberOfWeekdays + 1
              weekdays[i] = days
            }
          }
        
          // Because JavaScript weekdays start on Sunday and MySql starts on Monday
          const weekdaysMySql = [...weekdays]
          const sunday = weekdaysMySql.pop()
          weekdaysMySql.unshift(sunday)

          const dataWithAverage = result.map(element => {
            const { weekday, 'total_visits': totalVisits } = element
            const averageVisits = totalVisits / weekdaysMySql[weekday]
            return Object.assign({ 'average_visits': averageVisits}, element)
          })
      
          const resultWithUniqueIds = addUniqueIds(dataWithAverage)
          const data = resultWithUniqueIds
      
          return { status: 'ok', data } //meta
        } else {
          // BLOW UP YOUR VIDEO
        }
      } else {
        // Deal with a date range or whatever alternate info
      }
  } catch (error) {
    throw new Error(`Session Models Get Visits Count Average By Day Of Week ${error}`)
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
  getVisitsCountAverageByDayOfWeek,
  getVisitsCountTotal,
  getVisitsCountTotalByDay,
  getVisitsCountTotalByDayOfWeek,
  getVisitsCountTotalByHour,
  getVisitsCountTotalByMonth,
  getVisitsCountUnique,
  getVisitsCountUniqueByMonth,
  newSession
}
