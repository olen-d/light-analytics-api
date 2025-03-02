import { formatQueryDateTimeMySql, formatUTCDate } from './date-services.mjs'

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

const readPageStatisticDateRange = async (_db, info) => {
  const { statistic } = info
  const validStatistics = [
    'route',
    'session_id'
  ]

  if (validStatistics.findIndex(element => element === statistic) === -1) {
    throw new Error('Invalid statistic provided for Read Page Statistic Date Range.')
  }

  try {
    const [rows, fields] = await _db.execute(
      `(SELECT id, created_at FROM pages WHERE ${statistic} IS NOT NULL ORDER BY created_at ASC LIMIT 1) UNION (SELECT id, created_at FROM pages WHERE ${statistic} IS NOT NULL ORDER BY created_at DESC LIMIT 1)`
    )
    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Read Page Statistic Services Read ${info.statistic} Date Range ${error}`)
  }
}

const readRoutesBySinglePageSessions = async (_db, info) => {
  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT route, COUNT(*) AS single_page_sessions FROM pages INNER JOIN (SELECT session_id FROM pages GROUP BY session_id HAVING COUNT(*) = 1) AS ONLY_ONCE ON pages.session_id = ONLY_ONCE.session_id GROUP BY route ORDER BY single_page_sessions DESC, route ASC'
      )
      return rows && rows.length > 0 ? rows: -99
    } else {
      const { endDate, startDate } = info

      if (endDate && startDate) {
      const [rows, fields] = await _db.execute(
        'SELECT route, COUNT(*) AS single_page_sessions FROM pages INNER JOIN (SELECT session_id FROM (SELECT created_at, session_id, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY session_id HAVING COUNT(*) = 1) AS ONLY_ONCE ON pages.session_id = ONLY_ONCE.session_id GROUP BY route ORDER BY single_page_sessions DESC, route ASC',
        [startDate, endDate]
      )
      return rows && rows.length > 0 ? rows: -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Bounce Rate by Route ${error}`)
  }
}

const readSessionsTotal = async (_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT COUNT(DISTINCT session_id) AS total_sessions FROM pages'
      )
      return rows && rows.length > 0 ? rows: -99
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info

        const [rows, fields] = await _db.execute(
          'SELECT COUNT(DISTINCT session_id) AS total_sessions FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)',
          [startDate, endDate]
        )
        return rows && rows.length > 0 ? rows: -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Sessions Total ${error}`)
  }
}

const readTimeOnPageTotal = async (_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT SUM(time_on_page) AS total_time FROM pages'
      )
      return rows && rows.length > 0 ? rows: -99
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info
        const endDateFormatted = formatQueryDateTimeMySql(endDate)
        const startDateFormatted = formatQueryDateTimeMySql(startDate)

        const [rows, fields] = await _db.execute(
          'SELECT SUM(time_on_page) AS total_time FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)',
          [startDateFormatted, endDateFormatted]
        )
        return rows && rows.length > 0 ? rows: -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Time On Page Total ${error}`)
  }
}

const readRouteByViewsCountEntry = async (_db, info)=> {
  const { route } = info
  try {
    const [rows, fields] = await _db.execute(
      'SELECT entry_page, entry_page_count FROM (SELECT entry_page, COUNT(DISTINCT session_id) AS entry_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time ASC) as entry_page FROM pages) AS sb GROUP BY entry_page ORDER BY entry_page_count DESC) as mt WHERE entry_page = ?',
      [route]
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Route By Views Count Entry ${error}`)
  }
}

const readViewsCountEntry = async (_db, info) => {
  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT entry_page, COUNT(DISTINCT session_id) AS entry_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time ASC) as entry_page FROM pages) AS sb GROUP BY entry_page ORDER BY entry_page_count DESC'
      )
  
      return rows && rows.length > 0 ? rows : -99
    } else {
      const { endDate, startDate } = info
      if (endDate && startDate) {
        const [rows, fields] = await _db.execute(
          'SELECT entry_page, COUNT(DISTINCT session_id) AS entry_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time ASC) as entry_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) AS sb GROUP BY entry_page ORDER BY entry_page_count DESC',
          [startDate, endDate]
        )
    
        return rows && rows.length > 0 ? rows : -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Views Count Entry ${error}`)
  }
}

const readRouteByViewsCountExit = async (_db, info)=> {
  const { route } = info
  try {
    const [rows, fields] = await _db.execute(
      'SELECT exit_page, exit_page_count FROM (SELECT exit_page, COUNT(DISTINCT session_id) AS exit_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time DESC) as exit_page FROM pages) AS sb GROUP BY exit_page ORDER BY exit_page_count DESC) as mt WHERE exit_page = ?',
      [route]
    )

    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error(`Page Services Read Route By Views Count Exit ${error}`)
  }
}

const readViewsCountExit = async (_db, info) => {
  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT exit_page, COUNT(DISTINCT session_id) AS exit_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time DESC) as exit_page FROM pages) AS sb GROUP BY exit_page ORDER BY exit_page_count DESC'
      )
  
      return rows && rows.length > 0 ? rows : -99
    } else {
      const { endDate, startDate } = info
      if (endDate && startDate) {
        const [rows, fields] = await _db.execute(
          'SELECT exit_page, COUNT(DISTINCT session_id) AS exit_page_count FROM (SELECT session_id, page_start_time, route, FIRST_VALUE(route) OVER (PARTITION BY session_id ORDER BY page_start_time DESC) as exit_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) AS sb GROUP BY exit_page ORDER BY exit_page_count DESC',
          [startDate, endDate]
        )
    
        return rows && rows.length > 0 ? rows : -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Views Count Exit ${error}`)
  }
}

const readViewsCountTimeTotal = async (_db, info) => {
  try {
    if (info === 'all') {
    const [rows, fields] = await _db.execute(
      'SELECT SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages'
    )

    return rows && rows.length > 0 ? rows : -99
  } else {
    const { type } = info
    if (type === 'dates') {
      const { endDate, startDate } = info
      const endDateFormatted = formatQueryDateTimeMySql(endDate)
      const startDateFormatted = formatQueryDateTimeMySql(startDate)

      const [rows, fields] = await _db.execute(
        'SELECT SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)',
        [startDateFormatted, endDateFormatted]
      )
      return rows && rows.length > 0 ? rows : -99
    }
  }
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

const readViewsCountTotalByHour = async (_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m-%dH%H\') AS hour, COUNT(*) AS count FROM pages GROUP BY hour'
      )
      return rows && rows.length > 0 ? rows : -99
    } catch (error) {
      throw new Error(`Page Services Read Views Count Total By Hour (All) ${error}`)
    }
   } else {
    const { type } = info
    if (type === 'dates') {
      const { endDate, startDate } = info
      try {
        const [rows, fields] = await _db.execute(
          'SELECT DATE_FORMAT(created_at, \'%Y-%m-%dH%H\') AS hour, COUNT(*) AS count FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY hour',
          [startDate, endDate]
        )
        return rows && rows.length > 0 ? rows : -99
      } catch (error) {
        throw new Error(`Page Services Read Views Count Total By Hour (Dates) ${error}`)
      }
    }
   }
}

const readViewsCountTotalByMonth = async (_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, COUNT(*) AS count FROM pages GROUP BY month'
      )
      return rows && rows.length > 0 ? rows : -99
    } catch (error) {
      throw new Error(`Page Services Read Views By Month ${error}`)
    }
  } else {
    // Deal with custom info
  }
}

const readRouteComponentsByTotalViews = async (_db, info) => {
  const { component } = info
  const componentDelimiter = `/${component}/`
  const componentExpression = `${componentDelimiter}%`

  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT SUBSTRING_INDEX(route, ?, -1) as component_summary, COUNT(*) AS total_views FROM (SELECT route FROM pages WHERE route LIKE ?) AS t1 GROUP BY component_summary ORDER BY total_views DESC',
        [componentDelimiter, componentExpression]
      )

      return rows && rows.length > 0 ? rows : -99
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate} = info
        const [rows, fields] = await _db.execute(
          'SELECT SUBSTRING_INDEX(route, ?, -1) as component_summary, COUNT(*) AS total_views FROM (SELECT created_at, route FROM pages WHERE route LIKE ? AND (DATE(created_at) BETWEEN ? AND ?)) AS t1 GROUP BY component_summary ORDER BY total_views DESC',
          [componentDelimiter, componentExpression, startDate, endDate]
        )
  
        return rows && rows.length > 0 ? rows : -99
      }
    }
  } catch (error) {
    throw new Error(`Page Services Read Route Components by Total Views ${error}`)
  }
}

const readRouteComponentsByTotalTime = async (_db, info) => {
  const { component } = info
  const componentDelimiter = `/${component}/`
  const componentExpression = `${componentDelimiter}%`

  const validSortOrders = [
    'ASC',
    'DESC'
  ]

  if (info.sortOrder && validSortOrders.findIndex(element => element === info.sortOrder) === -1) {
    throw new Error('Invalid sort order provided for Read Route Components By Total Time.')
  }

  const nowObj = new Date()
  const defaultEndDate = formatUTCDate(nowObj, 'mySQLDate')

  const { endDate = defaultEndDate, limit, sortOrder, startDate } = info
  const limitAsNumber = Number(limit)
  const limitClause = limitAsNumber ? ` LIMIT ${limitAsNumber}` : ''
  const sortByClause = sortOrder ? ` ${sortOrder}` : ' DESC'

  try {
    if (startDate && endDate) {

      const [rows, fields] = await _db.execute(
        `SELECT SUBSTRING_INDEX(route, ?, -1) as component_summary, SUM(time_on_page) AS total_time FROM (SELECT created_at, route, time_on_page FROM pages WHERE route LIKE ? AND (DATE(created_at) BETWEEN ? AND ?)) AS t1 GROUP BY component_summary ORDER BY total_time${sortByClause}${limitClause}`,
        [componentDelimiter, componentExpression, startDate, endDate]
      )

      return rows && rows.length > 0 ? rows : -99
    } else {
      const [rows, fields] = await _db.execute(
        `SELECT SUBSTRING_INDEX(route, ?, -1) as component_summary, SUM(time_on_page) AS total_time FROM (SELECT route, time_on_page FROM pages WHERE route LIKE ?) AS t1 GROUP BY component_summary ORDER BY total_time${sortByClause}${limitClause}`,
        [componentDelimiter, componentExpression]
      )

      return rows && rows.length > 0 ? rows : -99
    }
  } catch (error) {
    throw new Error(`Page Services Read Route Components by Total Time ${error}`)
  }
}

const readRoutesByTimePerView = async (_db, info) => {
  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT route, total_time / total_views AS time_per_view FROM (SELECT route, SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages GROUP BY route) AS t1 ORDER BY time_per_view DESC'
      )
  
      return rows && rows.length > 0 ? rows : -99
    } else {
      const { endDate, levels, startDate } = info
      if (endDate && levels && startDate) {
        const [rows, fields] = await _db.execute(
          'SELECT route_consolidated, total_time / total_views AS time_per_view FROM (SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, CAST(ROUND(SUM(time_on_page)) AS SIGNED) AS total_time, COUNT(*) AS total_views FROM (SELECT created_at, route, time_on_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route_consolidated) as t2 ORDER BY time_per_view DESC',
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
          'SELECT route, total_time / total_views AS time_per_view FROM (SELECT route, CAST(ROUND(SUM(time_on_page)) AS SIGNED) AS total_time, COUNT(*) AS total_views FROM (SELECT created_at, route, time_on_page FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route) as t2 ORDER BY time_per_view DESC',
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
          'SELECT route_consolidated, total_time / total_views AS time_per_view FROM (SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, SUM(time_on_page) AS total_time, COUNT(*) AS total_views FROM pages GROUP BY route_consolidated) AS t1 ORDER BY time_per_view DESC',
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

const readRouteByTotalTime = async (_db, info) => {
  const { route } = info
  const routeDecoded = decodeURIComponent(route)

  try {
    const [rows, fields] = await _db.execute(
      'SELECT route, SUM(time_on_page) AS total_time FROM pages  WHERE route = ? GROUP BY route',
      [routeDecoded]
    )
    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error (`Page Services Read Route By Total Time ${error}`)
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

const readRouteByTotalViews = async (_db, info) => {
  const { route } = info
  const routeDecoded = decodeURIComponent(route)

  try {
    const [rows, fields] = await _db.execute(
      'SELECT route, COUNT(*) AS total_views FROM pages WHERE route = ? GROUP BY route',
      [routeDecoded]
    )
    return rows && rows.length > 0 ? rows : -99
  } catch (error) {
    throw new Error (`Page Services Read Route By Total Views ${error}`)
  }
}

const readRoutesByTotalViews = async (_db, info) => {
  try {
    if (info.all) {
      const [rows, fields] = await _db.execute(
        'SELECT route, COUNT(*) AS total_views FROM pages GROUP BY route ORDER BY total_views DESC'
      )
      return rows && rows.length > 0 ? rows : -99
    }
    const { endDate, levels, startDate } = info
    if (levels && startDate && endDate) {
      const [rows, fields] = await _db.execute(
        'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, COUNT(*) AS total_views FROM (SELECT created_at, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route_consolidated ORDER BY total_views DESC',
        [levels, startDate, endDate]
      )
      return rows && rows.length > 0 ? rows : -99
    }
    if (startDate && endDate) {
      const [rows, fields] = await _db.execute(
        'SELECT route, COUNT(*) AS total_views FROM (SELECT created_at, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route ORDER BY total_views DESC',
        [startDate, endDate]
      )
      return rows && rows.length > 0 ? rows : -99
    }
    if (levels) {
      const [rows, fields] = await _db.execute(
        'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, COUNT(*) AS total_views FROM pages GROUP BY route_consolidated ORDER BY total_views DESC',
        [levels]
      )
      return rows && rows.length > 0 ? rows : -99
    }
  } catch (error) {
    throw new Error(`Page Services Read Routes by Total Views ${error}`)
  }
}

const readRoutesByTotalUniqueViews = async (_db, info) => {
  if (info.all) {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT route, COUNT(DISTINCT session_id) AS total_unique_views FROM pages GROUP BY route ORDER BY total_unique_views DESC'
      )
      return rows && rows.length > 0 ? rows : -99
    } catch (error) {
      throw new Error(`Page Services Read Routes by Unique Views ${error}`)
    }
  } else {
    const { endDate, levels, startDate } = info 
    try {
      if (levels && startDate && endDate) {
        const [rows, fields] = await _db.execute(
          'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, COUNT(DISTINCT session_id) AS total_unique_views FROM (SELECT created_at, session_id, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route_consolidated ORDER BY total_unique_views DESC',
          [levels, startDate, endDate]
        )
        return rows && rows.length > 0 ? rows : -99
      }
      if (startDate && endDate) {
        const [rows, fields] = await _db.execute(
          'SELECT route, COUNT(DISTINCT session_id) AS total_unique_views FROM (SELECT created_at, session_id, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?)) as t1 GROUP BY route ORDER BY total_unique_views DESC',
          [startDate, endDate]
        )
        return rows && rows.length > 0 ? rows : -99
      }
      if (levels) {
        const [rows, fields] = await _db.execute(
          'SELECT SUBSTRING_INDEX(route, \'/\', ?) AS route_consolidated, COUNT(DISTINCT session_id) AS total_unique_views FROM pages GROUP BY route_consolidated ORDER BY total_unique_views DESC',
          [levels]
        )
        return rows && rows.length > 0 ? rows : -99
      }
    } catch (error) {
      throw new Error(`Page Services Read Routes by Unique Views Date Range ${error}`)
    }
  }
}

export {
  createPage,
  readPageStatisticDateRange,
  readRouteComponentsByTotalViews,
  readRouteComponentsByTotalTime,
  readRouteByTotalTime,
  readRouteByTotalViews,
  readRouteByViewsCountEntry,
  readRouteByViewsCountExit,
  readRoutesBySinglePageSessions,
  readRoutesByTimePerView,
  readRoutesByTotalTime,
  readRoutesByTotalTimeViews,
  readRoutesByTotalViews,
  readRoutesByTotalUniqueViews,
  readSessionsTotal,
  readTimeOnPageTotal,
  readViewsCountEntry,
  readViewsCountExit,
  readViewsCountTimeByDay,
  readViewsCountTimeTotal,
  readViewsCountTotalByHour,
  readViewsCountTotalByMonth
}
