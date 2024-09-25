'use strict'

import {
  createPage,
  readBounceRateByRoute,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readViewsCountTotalByMonth,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews,
  readRoutesByTotalUniqueViews
} from '../../services/v1/page-services.mjs'

const getBounceRateByRoute = async (_db, info) => {
  try {
    const result = await readBounceRateByRoute(_db, info)
    const status = await result != -99 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Page Models Get Bounce Rate By Route ${error}`)
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
  getBounceRateByRoute,
  getViewsCountEntry,
  getViewsCountExit,
  getViewsCountTimeByDay,
  getViewsCountTimeTotal,
  getViewsCountTotalByMonth,
  getRoutesByTotalTime,
  getRoutesByTotalTimeViews,
  getRoutesByTotalViews,
  getRoutesByTotalUniqueViews,
  newPage
}
