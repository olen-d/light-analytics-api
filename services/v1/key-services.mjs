'use strict'

const createKey = async (_db, info) => {
  try {
    const { domain, hashedKey, keyName, keyPrefix, ownerId, scopes } = info
    const scopesProcessed = scopes.join(',')
    const result = await _db.execute(
      'INSERT INTO api_keys (api_key, prefix, name, scopes, domain, owner_id) VALUES (?,?,?,?,?,?)',
      [hashedKey, keyPrefix, keyName, scopesProcessed, domain, ownerId]
    )
    return result
  } catch (error) {
    throw new Error(`Key Services Create Key ${error}`)
  }
}

const readKeyDomainScope = async (_db, info) => {
  try {
    const { hashedKey } = info
    const [rows, fields] = await _db.execute(
      'SELECT scopes, domain FROM api_keys WHERE api_key = ? LIMIT 1',
      [hashedKey]
    )

    if (rows && rows.length > 0) {
      const [{ scopes }] = rows
      rows[0].scopes = scopes.split(',')
    }

    return rows
  } catch (error) {
    throw new Error(`Key Services Read Key Domain Scope ${error}`)
  }
}
export { createKey, readKeyDomainScope }
