'use strict'

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
export { createSession, readVisitsCountTotal }
