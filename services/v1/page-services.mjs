'use strict'

const createPage = async (_db, info) => {
  try {
    const { sessionId, pageStartTime, route, pageName, timeOnPage } = info

    const result = await _db.execute(
      'INSERT INTO pages (session_id, page_start_time, route, page_name, time_on_page) VALUES (?,?,?,?,?)',
      [sessionId, pageStartTime, route, pageName, timeOnPage]
    )
    return result
  } catch (error) {
    throw new Error(`Page Services Create Page ${error}`)
  }
}

const readRoutesByTotalTime = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT route, SUM(time_on_page) AS total_time FROM pages GROUP BY route ORDER BY total_time DESC'
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Routes by Total Time ${error}`)
  }
}

const readRoutesByTotalTimeViews = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT route, SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages GROUP BY route ORDER BY total_time DESC'
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Routes by Total Time Views ${error}`)
  }
}

const readRoutesByTotalViews = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT route, COUNT(*) AS total_views FROM pages GROUP BY route ORDER BY total_views DESC'
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Routes by Total Views ${error}`)
  }
}

export { createPage, readRoutesByTotalTime, readRoutesByTotalTimeViews, readRoutesByTotalViews }
