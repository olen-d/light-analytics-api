const createSession = async (_db, info) => {
  try {
    const {
      sessionId,
      sessionStartTime,
      clientIp,
      device,
      userAgent,
      language,
      timezone,
      referrer,
      latency,
      pageLoad,
    } = info

    const result = await _db.execute(
      'INSERT INTO sessions (session_id, session_start_time, client_ip, device, user_agent, language, timezone, referrer, latency, page_load) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [sessionId, sessionStartTime, clientIp, device, userAgent, language, timezone, referrer, latency, pageLoad]
    )
    return result
  } catch (error) {
    throw new Error(`Session Services Create Session ${error}`)
  }
}

const readLanguageCount = async (_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT language, COUNT(*) AS count FROM sessions WHERE language IS NOT NULL GROUP BY language ORDER BY count DESC'
      )

      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } catch (error) {
      throw new Error(`Session Services Read Language Count ${error}`)
    }
  } // Else get other types, e.g. date ranges
}

const readReferrerCount = async (_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT referrer, COUNT(*) AS count FROM sessions WHERE referrer IS NOT NULL GROUP BY referrer ORDER BY count DESC'
      )

      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } catch (error) {
      throw new Error(`Session Services Read Referrer Count ${error}`)
    }
  } // Else get other types, e.g. date ranges
}

const readSinglePageSessionsCountTotal = async (_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT COUNT(*) AS count FROM (SELECT COUNT(*) FROM (SELECT session_id, route FROM pages GROUP BY session_id, route) as TT GROUP BY session_id HAVING COUNT(*) = 1) as ONLY_ONCE'
      )

      if (rows && rows.length > 0) {
        const [{ count }] = rows
        return count
      } else {
        return -99
      }
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info

        const [rows, fields] = await _db.execute(
          'SELECT COUNT(*) as count from (SELECT COUNT(*) from (SELECT session_id, route FROM pages WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY session_id, route) as TT GROUP BY session_id HAVING COUNT(*) = 1) as ONLY_ONCE',
          [startDate, endDate]
        )

        if (rows && rows.length > 0) {
          const [{ count }] = rows
          return count
        } else {
          return -99
        }
      }
    }
  } catch (error) {
    throw new Error(`Session Services Read Single Page Sessions Total ${error}`)
  }
}

const readSinglePageSessionsCountTotalByMonth = async (_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT month, COUNT(*) AS count FROM (SELECT month, COUNT(*) FROM (SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, session_id, route FROM pages GROUP BY month, session_id, route) AS TT GROUP BY month, session_id HAVING COUNT(*) = 1) AS ONLY_ONCE GROUP BY month'
      )

      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } catch (error) {
      throw new Error(`Session Services Read Single Page Sessions Total ${error}`)
    }
  } // Else get other types, e.g. date ranges
}

const readVisitsCountTotal = async (_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT COUNT(*) as count FROM sessions'
      )
  
      if (rows && rows.length > 0) {
        const [{ count }] = rows
        return count
      } else {
        return -99
      }
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info;

        const [rows, fields] = await _db.execute(
          'SELECT COUNT(*) AS count FROM sessions WHERE (DATE(created_at) BETWEEN ? AND ?)',
          [startDate, endDate]
        )

        if (rows && rows.length > 0) {
          const [{ count }] = rows
          return count
        } else {
          return -99
        }
      }
    }
  } catch (error) {
    throw new Error(`Session Services Read Visits Count Total ${error}`)
  }
}

const readVisitsCountTotalByDay = async(_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m-%d\') AS day, COUNT(*) AS count FROM sessions GROUP BY day'
      )
      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info

        const [rows, fields] = await _db.execute(
          'SELECT DATE_FORMAT(created_at, \'%Y-%m-%d\') AS day, COUNT(*) AS count FROM sessions WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY day',
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
    throw new Error(`Session Services Read Visits Count Total By Day ${error}`)
  }
}

const readVisitsCountTotalByMonth = async(_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, COUNT(*) AS count FROM sessions GROUP BY month'
      )
      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } catch (error) {
      throw new Error(`Session Services Read Visits Count Total By Month (All) ${error}`)
    }
  } else {
    const { type } = info
    if (type === 'dates') {
      const { endDate, startDate } = info
      try {
        const [rows, fields] = await _db.execute(
          'SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, COUNT(*) AS count FROM sessions WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY month',
          [startDate, endDate]
        )
        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      } catch (error) {
        throw new Error(`Session Services Read Visits Count Total By Month (Dates) ${error}`)
      }
    }
  }
}

const readVisitsCountUnique = async (_db, info) => {
  try {
    if (info === 'all') {
      const [rows, fields] = await _db.execute(
        'SELECT COUNT(distinct client_ip) AS count FROM sessions'
      )

      if (rows && rows.length > 0) {
        const [{ count }] = rows
        return count
      } else {
        return -99
      }
    } else {
      const { type } = info
      if (type === 'dates') {
        const { endDate, startDate } = info

        const [rows, fields] = await _db.execute(
          'SELECT COUNT(distinct client_ip) AS count FROM sessions WHERE (DATE(created_at) BETWEEN ? AND ?)',
          [startDate, endDate]
        )

        if (rows && rows.length > 0) {
          const [{ count }] = rows
          return count
        } else {
          return -99
        }
      }
    }
  } catch (error) {
    throw new Error(`Session Services Read Visits Count Unique ${error}`)
  }
}

const readVisitsCountUniqueByMonth = async(_db, info) => {
  if (info === 'all') {
    try {
      const [rows, fields] = await _db.execute(
        'SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, COUNT(distinct client_ip) AS count FROM sessions GROUP BY month'
      )
      if (rows && rows.length > 0) {
        return rows
      } else {
        return -99
      }
    } catch (error) {
      throw new Error(`Session Services Read Visits Count Unique By Month (All) ${error}`)
    }
  } else {
    const { type } = info
    if (type === 'dates') {
      const { endDate, startDate } = info
      try {
        const [rows, fields] = await _db.execute(
          'SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS month, COUNT(distinct client_ip) AS count FROM sessions WHERE (DATE(created_at) BETWEEN ? AND ?) GROUP BY month',
          [startDate, endDate]
        )
        if (rows && rows.length > 0) {
          return rows
        } else {
          return -99
        }
      } catch (error) {
        throw new Error(`Session Services Read Visits Count Unique By Month (Dates) ${error}`)
      }
    }
  }
}

const readVisitsFirstTime = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT created_at FROM sessions ORDER BY created_at ASC LIMIT 1'
    )

    if (rows && rows.length > 0) {
      const[{ 'created_at': startDate }] = rows
      return startDate
    } else {
      return -99
    }
  } catch (error) {
    throw new Error(`Session Services Read Visits First Time ${error}`)
  }
}

const readVisitsLastTime = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT created_at FROM sessions ORDER BY created_at DESC LIMIT 1'
    )

    if (rows && rows.length > 0) {
      const[{ 'created_at': endDate }] = rows
      return endDate
    } else {
      return -99
    }
  } catch (error) {
    throw new Error(`Session Services Read Visits Last Time ${error}`)
  }
}

export {
  createSession,
  readLanguageCount,
  readReferrerCount,
  readSinglePageSessionsCountTotal,
  readSinglePageSessionsCountTotalByMonth,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountTotalByMonth,
  readVisitsCountUnique,
  readVisitsCountUniqueByMonth,
  readVisitsFirstTime,
  readVisitsLastTime
}
