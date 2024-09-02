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
      latency,
      pageLoad,
    } = info

    const result = await _db.execute(
      'INSERT INTO sessions (session_id, session_start_time, client_ip, device, user_agent, language, timezone, latency, page_load) VALUES (?,?,?,?,?,?,?,?,?)',
      [sessionId, sessionStartTime, clientIp, device, userAgent, language, timezone, latency, pageLoad]
    )
    return result
  } catch (error) {
    throw new Error(`Session Services Create Session ${error}`)
  }
}


const readSinglePageSessionsCountTotal = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'select count(*) as count from (select count(*) from (select session_id, route from pages group by session_id, route) as TT GROUP BY session_id HAVING count(*) = 1) as ONLY_ONCE'
    )

    if (rows && rows.length > 0) {
      const [{ count }] = rows
      return count
    } else {
      return -99
    }
  } catch (error) {
    throw new Error(`Session Services Read Single Page Sessions Total ${error}`)
  }
}

const readVisitsCountTotal = async (_db, info) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT COUNT(*) as count FROM sessions'
    )

    if (rows && rows.length > 0) {
      const [{ count }] = rows
      return count
    } else {
      return -99
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
    const [rows, fields] = await _db.execute(
      'SELECT COUNT(distinct client_ip) as count FROM sessions'
    )

    if (rows && rows.length > 0) {
      const [{ count }] = rows
      return count
    } else {
      return -99
    }
  } catch (error) {
    throw new Error(`Session Services Read Visits Count Unique ${error}`)
  }
}

export {
  createSession,
  readSinglePageSessionsCountTotal,
  readVisitsCountTotal,
  readVisitsCountTotalByDay,
  readVisitsCountTotalByMonth,
  readVisitsCountUnique
}
