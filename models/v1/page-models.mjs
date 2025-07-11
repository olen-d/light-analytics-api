import {
  createPage,
  readPageStatisticDateRange,
  readRouteByTotalTime,
  readRouteByTotalViews,
  readRouteByViewsCountEntry,
  readRouteByViewsCountExit,
  readRouteComponentsByTotalViews,
  readRouteComponentsByTotalTime,
  readRoutesBySinglePageSessions,
  readRoutesByTimePerView,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalUniqueViews,
  readRoutesByTotalViews,
  readSessionsTotal,
  readTimeOnPageTotal,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTotalByHour,
  readViewsCountTotalByMonth,
  readViewsCountTimeTotal,
} from '../../services/v1/page-services.mjs'

import { addUniqueIds } from '../../services/v1/aggregation-services.mjs'

// Exports
const getRoutesByBounceRate = async (_db, info) => {
  try {
    const resultSinglePageSessions = await readRoutesBySinglePageSessions(_db, info)
    const resultTotalViews = await readRoutesByTotalViews(_db, info)

    const routesByBounceRate = resultTotalViews.map(element => {
      const { route, 'total_views': totalViews } = element
      const indexSPS = resultSinglePageSessions.findIndex(item => item.route === route)
      const sps = indexSPS === -1 ? 0 : resultSinglePageSessions[indexSPS]['single_page_sessions']
      const bounceRate = sps / totalViews
      return { route, bounceRate }
    })

    const routesByBounceRateSorted = routesByBounceRate.toSorted((a, b) => a.bounceRate === b.bounceRate ? b.route.localeCompare(a.route) : b.bounceRate - a.bounceRate)

    const routesByBounceRateWithIds = addUniqueIds(routesByBounceRateSorted)
    const data = routesByBounceRateWithIds

    if (info.all)
    {
      const infoDateRange = { all: true, statistic: 'route' }
      const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
  
      const routeDateRange = resultDateRange.map(element => {
        return element['created_at']
      })
  
      const [startDate, endDate] = routeDateRange

      return { 'status': 'ok', data, meta: { startDate, endDate } }
    } else {
      return { 'status': 'ok', data }
    }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Bounce Rate ${error}`)
  }
}

const getRoutesBySinglePageSessions = async (_db, info) => {
  try {
    const result = await readRoutesBySinglePageSessions(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Routes By Single Page Sessions ${error}`)
  }
}

const getViewsCountEntry = async (_db, info) => {
  try {
    const result = await readViewsCountEntry(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
    {
      const infoDateRange = { all: true, statistic: 'route' }
      const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
  
      const routeDateRange = resultDateRange.map(element => {
        return element['created_at']
      })
  
      const [startDate, endDate] = routeDateRange

      return { 'status': 'ok', data, meta: { startDate, endDate } }
    } else {
      return { 'status': 'ok', data }
    }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Entry ${error}`)
  }
}

const getViewsCountExit = async (_db, info) => {
  try {
    const result = await readViewsCountExit(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
    {
      const infoDateRange = { all: true, statistic: 'route' }
      const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
  
      const routeDateRange = resultDateRange.map(element => {
        return element['created_at']
      })
  
      const [startDate, endDate] = routeDateRange

      return { 'status': 'ok', data, meta: { startDate, endDate } }
    } else {
      return { 'status': 'ok', data }
    }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Exit ${error}`)
  }
}

const getViewsCountTimeByDay = async (_db, info) => {
  try {
    const result = await readViewsCountTimeByDay(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? { totalViewsByDay: result } : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Time By Day ${error}`)
  }
}

const getViewsCountTimeTotal = async (_db, info) => {
  try {
    const result = await readViewsCountTimeTotal(_db, info)

    const [{ 'total_time': totalTime, 'total_views': totalViews }] = result

    if (result !== -99) {
      return { status: 'ok', data: { totalTime, totalViews }, }
    } else {
      return { status: 'error', data: null }
    }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Time Total ${error}`)
  }
}

const getViewsCountTotalByHour = async(_db, info) =>{
  try {
    const result = await readViewsCountTotalByHour(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? { totalViewsByHour: result } : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Total By Hour ${error}`)
  }
}

const getViewsCountTotalByMonth = async(_db, info) =>{
  try {
    const result = await readViewsCountTotalByMonth(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? { totalViewsByMonth: result } : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Total By Month ${error}`)
  }
}

const getRouteComponentsByTotalViews = async (_db, info) => {
  try {
    const result = await readRouteComponentsByTotalViews(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Route Components by Total Views ${error}`)
  }
}

const getRouteComponentsByTotalTime = async (_db, info) => {
  try {
    const result = await readRouteComponentsByTotalTime(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    const dataTimeToNumber = data.map(element => {
      element['total_time'] = Number(element['total_time'])
      return element
    })

    const resultWithUniqueIds = addUniqueIds(dataTimeToNumber)

    return { status, data: resultWithUniqueIds }
  } catch (error) {
    throw new Error(`Page Models Get Route Components by Total Time ${error}`)
  }
}

const getRoutesByTimePerView = async (_db, info) => {
  try {
    const result = await readRoutesByTimePerView(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
      {
        const infoDateRange = { all: true, statistic: 'route' }
        const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
    
        const routeDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = routeDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Time per View ${error}`)
  }
}

const getRoutesByTotalTime = async (_db, info) => {
  try {
    const result = await readRoutesByTotalTime(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Time ${error}`)
  }
}

const getRoutesByTotalTimeViews = async (_db, info) => {
  try {
    const result = await readRoutesByTotalTimeViews(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
      {
        const infoDateRange = { all: true, statistic: 'route' }
        const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
    
        const routeDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = routeDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Time Views ${error}`)
  }
}

const getRouteSummary = async (_db, info) => {
  try {
    const resultTime = await readRouteByTotalTime(_db, info)
    const resultViews = await readRouteByTotalViews(_db, info)
    const resultEntries = await readRouteByViewsCountEntry(_db, info)
    const resultExits = await (readRouteByViewsCountExit(_db, info))

    const [{ route, 'total_time': totalTime }] = resultTime === -99 ? [{ 'total_time': 0 }] : resultTime
    const [{ 'total_views': totalViews }] = resultViews === -99 ? [{ 'total_views': 0 }] : resultViews
    const [{ 'entry_page_count': entryPageCount }] = resultEntries === -99 ? [{ 'entry_page_count': 0 }] : resultEntries
    const [{ 'exit_page_count': exitPageCount }] = resultExits === -99 ? [{ 'exit_page_count': 0 }] : resultExits

    const averageTime = totalTime / totalViews

    const data = {
      route,
      totalTime,
      totalViews,
      averageTime,
      entryPageCount,
      exitPageCount
    }

    return { 'status': 'ok', data }
  } catch (error) {
    throw new Error(`Page Models Get Route Summary ${error}`)
  }
}

const getRoutesByTotalViews = async (_db, info) => {
  try {
    const result = await readRoutesByTotalViews(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
      {
        const infoDateRange = { all: true, statistic: 'route' }
        const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
    
        const routeDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = routeDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Views ${error}`)
  }
}

const getRoutesByTotalUniqueViews = async (_db, info) => {
  try {
    const result = await readRoutesByTotalUniqueViews(_db, info)
    const resultWithUniqueIds = addUniqueIds(result)
    const data = resultWithUniqueIds

    if (info.all)
      {
        const infoDateRange = { all: true, statistic: 'route' }
        const resultDateRange = await readPageStatisticDateRange(_db, infoDateRange)
    
        const routeDateRange = resultDateRange.map(element => {
          return element['created_at']
        })
    
        const [startDate, endDate] = routeDateRange

        return { 'status': 'ok', data, meta: { startDate, endDate } }
      } else {
        return { 'status': 'ok', data }
      }

  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Unique Views ${error}`)
  }
}

const getSessionsTotal= async (_db, info) => {
 try {
  const result = await readSessionsTotal(_db, info)
  const status = await result != -99 ? 'ok' : 'error'
  const data = status === 'ok' ? result : null

  return { status, data}
 } catch (error) {
    throw new Error(`Page Models Get Sessions Total ${error}`)
  }
}

const getTimeOnPageTotal= async (_db, info) => {
  try {
   const result = await readTimeOnPageTotal(_db, info)
   const status = await result != -99 ? 'ok' : 'error'
   const data = status === 'ok' ? result : null
 
   return { status, data}
  } catch (error) {
     throw new Error(`Page Models Get Time On Page Total ${error}`)
   }
 }

const newPage = async (_db, info) => {
  try {
    const result = await createPage(_db, info)
    const status = await result[0].affectedRows === 1 ? 'ok' : 'error'
    const data = status === 'ok' ? { insertId: result[0].insertId } : result

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models New Page ${error}`)
  }
}

export {
  getSessionsTotal,
  getTimeOnPageTotal,
  getRouteComponentsByTotalViews,
  getRouteComponentsByTotalTime,
  getRoutesByBounceRate,
  getRoutesBySinglePageSessions,
  getRoutesByTimePerView,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalUniqueViews,
  getRoutesByTotalViews,
  getRouteSummary,
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTotalByHour,
  getViewsCountTotalByMonth,
  getViewsCountTimeTotal,
  newPage
}
