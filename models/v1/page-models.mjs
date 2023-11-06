'use strict'

import { createPage, readRoutesByTotalTime, readRoutesByTotalViews } from '../../services/v1/page-services.mjs'

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

export { getRoutesByTotalTime, getRoutesByTotalViews, newPage }
