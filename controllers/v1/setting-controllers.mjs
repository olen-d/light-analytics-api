import { getAllSettings, newExcludedQueryParameters } from '../../models/v1/setting-models.mjs'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'

async function addExcludedQueryParameters (request, reply) {
  const { _db } = this
  const { body } = request

  const trimmed = trimAll(body)
  const sanitized = sanitizeAll(trimmed)

  const { queryParameters } = sanitized

  const info = { name: 'excludedURLQueryParameters', value: queryParameters }

  try {
    const result = await newExcludedQueryParameters(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Setting Controllers Add Excluded Query Parameters ${error}`)
  }
}

async function readAllSettings (request, reply) {
  const { _db } = this

  try {
    const result = await getAllSettings(_db)
    reply.send(result)
  } catch (error) {
    throw new Error(`Setting Controllers Read All Settings ${error}`)
  }
}

export { addExcludedQueryParameters, readAllSettings }
