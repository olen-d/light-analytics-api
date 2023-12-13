'use strict'

const createUser = async (_db, info) => {
  try {
    const {
      createdBy,
      email,
      firstName,
      lastName,
      passwordHash,
      role,
      username
    } = info

    const result = await _db.execute(
      'INSERT INTO users (created_by, email_address, first_name, last_name, password_hash, role, username) VALUES (?,?,?,?,?,?,?)',
      [createdBy, email, firstName, lastName, passwordHash, role, username]
    )
    return result
  } catch (error) {
    throw new Error(`User Services Create User ${error}`)
  }
}

const readUserByUsername = async (_db, info) => {
  try {
    const { username } = info

    const [rows, fields] = await _db.execute(
      'SELECT id, created_by, created_at, modified_at, email_address, first_name, last_name, role, username FROM users WHERE username = ? LIMIT 1',
      [username]
    )

    return (rows && rows.length > 0) ? rows : false
  } catch (error) {
    throw new Error(`User Services Read User By Username ${error}`)
  }
}

export { createUser, readUserByUsername }
