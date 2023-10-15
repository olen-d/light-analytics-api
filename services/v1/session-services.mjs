'use strict'

const createSession = async (_db, info) => {
  try {
    const {
      sessionId,
      sessionStartTime,
      // sessionEndTime,
      clientIp,
      device,
      userAgent,
      language,
      timezone,
      latency,
      pageLoad,
      // landingPage,
      // exitPage
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

export { createSession }
