import * as fs from 'fs'

const createRefreshToken = async (_db, info) => {
  try {
    const {
      userId,
      refreshToken,
      clientIp: ipAddress
    } = info
    const result = await _db.execute(
      'INSERT into refresh_tokens (user_id, refresh_token, ip_address) VALUES (?, ?, ?)',
      [userId, refreshToken, ipAddress]
    )
    return result
  } catch (error) {
    throw new Error(`Auth Services Create Refresh Token ${error}`)
  }
}

const readPublicKeyTokenBearer = publicKeyFile => {
  try {
    const publicKey = fs.readFileSync(publicKeyFile)
    return publicKey.toString()
  } catch (error) {
    throw new Error(`Auth Services Read Public Key Token Bearer ${error}`)
  }
}

const readRefreshToken = async (_db, userId, refreshToken, ipAddress) => {
  try {
    const [rows, fields] = await _db.execute(
      'SELECT * FROM refresh_tokens WHERE user_id = ? AND refresh_token = ?',
      [userId, refreshToken]
    )
    return (rows && rows.length > 0) ? rows : false
  } catch (error) {
    throw new Error(`Auth Services Read Refresh Token ${error}`)
  }
}


export { createRefreshToken, readPublicKeyTokenBearer, readRefreshToken }
