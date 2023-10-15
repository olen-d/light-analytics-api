'use strict'

import { generateKey } from '../../services/v1/generate-api-key.mjs'
import { hashKey} from '../../services/v1/hash-api-key.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import { newKey } from '../../models/v1/key-models.mjs'

async function addKey (req, reply) {
  try {
    const { _db } = this
    const { body } = req
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)
  
    const { domain, keyName, ownerId } = sanitized
    const key = generateKey()
    const keyPrefix = key.slice(0, 7)
    const hashedKey = hashKey(key)
    const scopes = ['read']
  
    const info = {
      domain,
      hashedKey,
      keyName,
      keyPrefix,
      ownerId,
      scopes
    }
  
    const result = await newKey(_db, info)
    result.data.apiKey = key
    reply.send(result)
  } catch (error) {
    throw new Error(`Key Controllers Add Key ${error}`)
  }
}

export { addKey }
