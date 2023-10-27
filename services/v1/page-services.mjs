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

export { createPage, readRoutesByTotalTime }
