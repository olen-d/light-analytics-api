import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import {
  getLanguageCount,
  getReferrerCount,
  getSinglePageSessionsCountTotal,
  getSinglePageSessionsCountTotalByMonth,
  getVisitsCountTotal,
  getVisitsCountTotalByDay,
  getVisitsCountTotalByHour,
  getVisitsCountTotalByMonth,
  getVisitsCountUnique,
  getVisitsCountUniqueByMonth,
  newSession
} from '../../models/v1/session-models.mjs'

import { formatUTCDate, getPreviousPeriodDates } from '../../services/v1/date-services.mjs'
import { readVisitsFirstTime, readVisitsLastTime } from '../../services/v1/session-services.mjs'

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

async function addSession (request, reply) {
  try {
    const { _db, getSetting } = this
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
      referrer,
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
      referrer,
      sessionEndTime,
      sessionId,
      sessionStartTime,
      timezone,
      userAgent
    }

    const newReferrer = filterQueryString(getSetting, info.referrer)
    if (newReferrer) { info.referrer = newReferrer }

    const result = await newSession(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Add Session ${error}`)
  }
}

async function readBounceRateTotal (request, reply) {
  const { _db } = this

  try {
    if (Object.keys(request.query).length === 0) {
      const info = 'all'

      const resultSinglePage = await getSinglePageSessionsCountTotal(_db, info)
      const endDate = await readVisitsLastTime(_db, info)
      const startDate = await readVisitsFirstTime(_db, info)
      const resultVisits = await getVisitsCountTotal(_db, info)
  
      const { data: { totalSinglePageSessions }, } = resultSinglePage
      const { totalVisits } = resultVisits
  
      const bounceRate = totalSinglePageSessions / totalVisits
  
      reply.send({
        'status': 'ok',
        'data': {
          bounceRate,
          startDate,
          endDate,
          bounceRatePrev: null,
          bounceRateChange: null
        }
      })
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      const info = { type: 'dates', endDate, startDate }

      const resultSinglePage = await getSinglePageSessionsCountTotal(_db, info)
      const resultVisits = await getVisitsCountTotal(_db, info)
  
      const { data: { totalSinglePageSessions }, } = resultSinglePage
      const { totalVisits } = resultVisits
  
      const bounceRate = totalSinglePageSessions / totalVisits
  
      const { endDatePrevJs, startDatePrevJs } = getPreviousPeriodDates(startDate, endDate)

      const endDatePrev = formatUTCDate(endDatePrevJs,'mySQLDate')
      const startDatePrev = formatUTCDate(startDatePrevJs,'mySQLDate')

      const prevInfo = { type: 'dates', 'endDate': endDatePrev, 'startDate': startDatePrev }
      const prevResultSinglePage = await getSinglePageSessionsCountTotal(_db, prevInfo)
      const prevResultVisits = await getVisitsCountTotal(_db, prevInfo)

      const { data: { totalSinglePageSessions: totalSinglePageSessionsPrev }, } = prevResultSinglePage
      const { totalVisits: totalVisitsPrev } = prevResultVisits

      const bounceRatePrev = totalSinglePageSessionsPrev / totalVisitsPrev
      const bounceRateChange = ( bounceRate - bounceRatePrev ) / bounceRatePrev

      reply.send({
        'status': 'ok',
        'data': {
          bounceRate,
          startDate,
          endDate,
          bounceRatePrev,
          bounceRateChange
        }
      })
    }
  } catch (error) {
    throw new Error(`Session Controllers Read Bounce Rate Total ${error}`)
  }
}

async function readLanguagerCount (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getLanguageCount(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Language Count ${error}`)
  }
}

async function readReferrerCount (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getReferrerCount(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Referrer Count ${error}`)
  }
}

async function readSinglePageSessionsCountTotal (request, reply) {
  try {
    const { _db } = this

    let info = null

    if (Object.keys(request.query).length === 0) {
      info = 'all'
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      info = { type: 'dates', endDate, startDate }
    }

    const result = await getSinglePageSessionsCountTotal(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Single Page Sessions Count Total ${error}`)
  }
}

async function readSinglePageSessionsCountTotalByMonth (request, reply) {
  try {
    const { _db } = this
    const info = 'all'

    const result = await getSinglePageSessionsCountTotalByMonth(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Single Page Sessions Count Total By Month ${error}`)
  }
}

async function readSummaryByMonth (request, reply) {
  const { _db } = this
  const info = 'all'

  const startDates = []
  const endDates = []

  const monthsInPeriod = []

  try {
    const resultTotal = await getVisitsCountTotalByMonth(_db, info)
    const resultUnique = await getVisitsCountUniqueByMonth(_db, info)
    const resultSinglePage = await getSinglePageSessionsCountTotalByMonth(_db, info)

    const { data: { totalVisitsByMonth }, } = resultTotal
    startDates.push(totalVisitsByMonth[0].month)
    endDates.push(totalVisitsByMonth[totalVisitsByMonth.length - 1].month)

    const { data: { totalUniqueVisitsByMonth }, } = resultUnique
    startDates.push(totalUniqueVisitsByMonth[0].month)
    endDates.push(totalUniqueVisitsByMonth[totalUniqueVisitsByMonth.length - 1].month)

    const { data: { totalSinglePageSessionsByMonth }, } = resultSinglePage
    startDates.push(totalSinglePageSessionsByMonth[0].month)
    endDates.push(totalSinglePageSessionsByMonth[totalSinglePageSessionsByMonth.length - 1].month)

    startDates.sort()
    endDates.sort().reverse()

    const startDate = startDates[0]
    const endDate = endDates[0]

    let m = startDate
    let nextYear = 0
    let nextMonth = 0

    while (m <= endDate) {
      monthsInPeriod.push(m)
      let [curYear, curMonth] = m.split('-')
      curYear = Number(curYear)
      curMonth = Number(curMonth)

      if (curMonth === 12) {
        nextYear = curYear + 1
        nextMonth = '01'
      } else {
        nextYear = curYear
        nextMonth = curMonth < 9 ? `0${curMonth + 1}` : curMonth + 1
      }
      m = `${nextYear}-${nextMonth}`
    }

    const summaryByMonthWithZeros = monthsInPeriod.map(item => {
      const indexTVBM = totalVisitsByMonth.findIndex(element => element.month === item)
      const indexUVBM = totalUniqueVisitsByMonth.findIndex(element => element.month === item)
      const indexSPBM = totalSinglePageSessionsByMonth.findIndex(element => element.month === item)
      const tvbm = indexTVBM === -1 ? 0 : totalVisitsByMonth[indexTVBM].count
      const uvbm = indexUVBM === -1 ? 0 : totalUniqueVisitsByMonth[indexUVBM].count
      const spbm = indexSPBM === -1 ? 0 : totalSinglePageSessionsByMonth[indexSPBM].count
      const bounceRate = spbm / tvbm
      return ({
        month: item,
        totalVisits: tvbm,
        uniqueVisits: uvbm,
        singlePageSessions: spbm,
        bounceRate
      })
    })
    const status = 'ok'
    reply.send({ status, data: { summaryByMonth: summaryByMonthWithZeros } })
  } catch (error) {
    throw new Error(`Session Controllers Read Summmary By Month ${error}`)
  }
}

async function readVisitsCountTotal (request, reply) {
  const { _db } = this

  try {
    if (Object.keys(request.query).length === 0) {
      const info = 'all'

      const endDate = await readVisitsLastTime(_db, info)
      const startDate = await readVisitsFirstTime(_db, info)
      const result = await getVisitsCountTotal(_db, info)

      const { status, totalVisits } = result

      const data =  {
        totalVisits,
        startDate,
        endDate,
        'totalVisitsPrev': null,
        'totalVisitsChange': null
      }

      reply.send({ status, data })
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      const info = { type: 'dates', endDate, startDate }

      const result = await getVisitsCountTotal(_db, info)

      const { status, totalVisits } = result

      const { endDatePrevJs, startDatePrevJs } = getPreviousPeriodDates(startDate, endDate)

      const endDatePrev = formatUTCDate(endDatePrevJs,'mySQLDate')
      const startDatePrev = formatUTCDate(startDatePrevJs,'mySQLDate')

      const prevInfo = { type: 'dates', 'endDate': endDatePrev, 'startDate': startDatePrev }
      const prevResult = await getVisitsCountTotal(_db, prevInfo)

      const { prevStatus, totalVisits: totalVisitsPrev } = prevResult

      const totalVisitsChange = ( totalVisits - totalVisitsPrev ) / totalVisitsPrev

      const data =  {
        totalVisits,
        startDate,
        endDate,
        totalVisitsPrev,
        totalVisitsChange
      }

      reply.send({ status, data })
    }
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Total ${error}`)
  }
}

async function readVisitsCountTotalByDay (request, reply) {
  try {
    const { _db } = this

    let info = null
    if (Object.keys(request.query).length === 0) {
      info = 'all'
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      info = { type: 'dates', endDate, startDate }
    }
    const result = await getVisitsCountTotalByDay(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Total By Day ${error}`)
  }
}

async function acquireVisitsCountTotalByHour (request, reply) {
  try {
    const { _db } = this

    let info = null
    if (Object.keys(request.query).length === 0) {
      info = 'all'
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      info = { type: 'dates', endDate, startDate }
    }
    const result = await getVisitsCountTotalByHour(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Total By Hour ${error}`)
  }
}

async function readVisitsCountTotalByMonth (request, reply) {
  const { _db } = this

  let info = null

  if (Object.keys(request.query).length === 0) {
    info = 'all'
  } else {
    const { query: { enddate: endDate, startdate: startDate }, } = request
    info = { type: 'dates', endDate, startDate }
  }

  try {
    const result = await getVisitsCountTotalByMonth(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Total By Month ${error}`)
  }
}

async function readVisitsCountUnique (request, reply) {
  try {
    const { _db } = this

    if (Object.keys(request.query).length === 0) {
      const info = 'all'
      const endDate = await readVisitsLastTime(_db, info)
      const startDate = await readVisitsFirstTime(_db, info)
      const result = await getVisitsCountUnique(_db, info)

      const { status, uniqueVisits } = result

      const data =  {
        uniqueVisits,
        startDate,
        endDate,
        'uniqueVisitsPrev': null,
        'uniqueVisitsChange': null
      }

      reply.send({ status, data })
    } else {
      const { query: { enddate: endDate, startdate: startDate }, } = request
      const info = { type: 'dates', endDate, startDate }

      const result = await getVisitsCountUnique(_db, info)

      const { status, uniqueVisits } = result

      const { endDatePrevJs, startDatePrevJs } = getPreviousPeriodDates(startDate, endDate)

      const endDatePrev = formatUTCDate(endDatePrevJs,'mySQLDate')
      const startDatePrev = formatUTCDate(startDatePrevJs,'mySQLDate')

      const prevInfo = { type: 'dates', 'endDate': endDatePrev, 'startDate': startDatePrev }
      const prevResult = await getVisitsCountUnique(_db, prevInfo)

      const { prevStatus, uniqueVisits: uniqueVisitsPrev } = prevResult

      const uniqueVisitsChange = ( uniqueVisits - uniqueVisitsPrev ) / uniqueVisitsPrev

      const data =  {
        uniqueVisits,
        startDate,
        endDate,
        uniqueVisitsPrev,
        uniqueVisitsChange
      }

      reply.send({ status, data })
    }
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Unique ${error}`)
  }
}

async function readVisitsCountUniqueByMonth (request, reply) {
  const { _db } = this

  let info = null

  if (Object.keys(request.query).length === 0) {
    info = 'all'
  } else {
    const { query: { enddate: endDate, startdate: startDate }, } = request
    info = { type: 'dates', endDate, startDate }
  }

  try {
    const result = await getVisitsCountUniqueByMonth(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Session Controllers Read Visits Count Unique By Month ${error}`)
  }
}

export {
  acquireVisitsCountTotalByHour,
  addSession,
  readBounceRateTotal,
  readLanguagerCount,
  readReferrerCount,
  readSinglePageSessionsCountTotal,
  readSinglePageSessionsCountTotalByMonth,
  readSummaryByMonth,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountTotalByMonth,
  readVisitsCountUniqueByMonth,
  readVisitsCountUnique
}
