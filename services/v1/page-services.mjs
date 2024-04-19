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

const readViewsCountEntry = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT entry_page, COUNT(*) AS entry_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time ASC) as entry_page FROM pages) AS sb GROUP BY entry_page ORDER BY entry_page_count DESC'
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Views Count Entry ${error}`)
  }
}

const readViewsCountTimeTotal = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages'
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Views Count Time Total ${error}`)
  }
}

const readViewsCountTimeByDay = async (_db, info) => {
  try {
    if (info ==='all') {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m-%d\') AS day, SUM(time_on_page) AS total_time, COUNT(*) AS count FROM pages GROUP BY day'
      )
  
      return rows && rows.length > 0 ? rows : -99
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info

        const [rows, fields] = await _db.execute(
          'SELECT DATE_FORMAT(created_at, \'%Y-%m-%d\') AS day, SUM(time_on_page) AS total_time, COUNT(*) AS count FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY day',
          [startDate, endDate]
        )

        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Pages By Total Time Views ${error}`)
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
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT route, SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages GROUP BY route ORDER BY total_time DESC'
      )
  
      return rows && rows.length > 0 ? rows : -99
    } else {
      const { endDate, levels, startDate } = info
      if (endDate && levels && startDate) {
        const [rows, fields] = await _db.execute(
          'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, CAST(ROUND(SUM(time_on_page)) AS SIGNED) AS total_time, COUNT(*) AS total_views FROM (SELECT created_at, route, time_on_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route_consolidated ORDER BY total_time DESC',
          [levels, startDate, endDate]
        )

        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      }
      if (endDate && startDate) {
        const [rows, fields] = await _db.execute(
          'SELECT route, CAST(ROUND(SUM(time_on_page)) AS SIGNED) AS total_time, COUNT(*) AS total_views FROM (SELECT created_at, route, time_on_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route ORDER BY total_time DESC',
          [startDate, endDate]
        )

        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      }
      if (levels) {
        const [rows, fields] = await _db.execute(
          'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages GROUP BY route_consolidated ORDER BY total_time DESC',
          [levels]
        )

        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      }
    }
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

export {
  createPage,
  readViewsCountEntry,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews
}
