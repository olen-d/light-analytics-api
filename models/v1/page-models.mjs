'use strict'

import {
  createPage,
  readRoutesBySinglePageSessions,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalUniqueViews,
  readRoutesByTotalViews,
  readSessionsTotal,
  readTimeOnPageTotal,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTotalByMonth,
  readViewsCountTimeTotal
} from '../../services/v1/page-services.mjs'

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
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Entry ${error}`)
  }
}

const getViewsCountExit = async (_db, info) => {
  try {
    const result = await readViewsCountExit(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
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
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Views Count Time Total ${error}`)
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
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Time Views ${error}`)
  }
}

const getRoutesByTotalViews= async (_db, info) => {
  try {
    const result = await readRoutesByTotalViews(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Routes by Total Views ${error}`)
  }
}

const getRoutesByTotalUniqueViews = async (_db, info) => {
  const result = await readRoutesByTotalUniqueViews(_db, info)
  const status = await result != -99 ? 'ok' : 'error'
  const data = status === 'ok' ? result : null

  return { status, data}
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
  getRoutesBySinglePageSessions,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalUniqueViews,
  getRoutesByTotalViews,
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTotalByMonth,
  getViewsCountTimeTotal,
  newPage
}
