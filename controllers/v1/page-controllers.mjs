'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import { newPage } from '../../models/v1/page-models.mjs'

async function addPage (req, reply) {
  try {
    const { _db } = this
    const { body } = req
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)
  
    const {
      pageName,
      pageStartTime,
      route,
      sessionId,
      timeOnPage
    } = sanitized

  
    const info = {
      pageName,
      pageStartTime,
      route,
      sessionId,
      timeOnPage
    }
  
    const result = await newPage(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`Page Controllers Add Page ${error}`)
  }
}

export { addPage }
