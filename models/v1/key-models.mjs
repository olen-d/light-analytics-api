'use strict'

import { createKey, readKeyDomainScope } from '../../services/v1/key-services.mjs'

const geteKeyDomainScope = async (_db, info) => {
  try {
    const result = await readKeyDomainScope(_db, info)
    const status = result && result.length > 0 ? 'ok' : 'error'
    const data = status === 'ok' ? result : null

    return { status, data }
  } catch (error) {
    throw new Error(`Key Models Get Key Domain Scope ${error}`)
  }
}
const newKey = async (_db, info) => {
  try {
    const result = await createKey(_db, info)
    const status = await result[0].affectedRows === 1 ? 'ok' : 'error'
    const data = status === 'ok' ? { insertId: result[0].insertId } : result

    return { status, data }
  } catch (error) {
    throw new Error(`Key Models New Key ${error}`)
  }
}

export { geteKeyDomainScope, newKey }
