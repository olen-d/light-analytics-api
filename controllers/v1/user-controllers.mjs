'use strict'

import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'

import { newUser } from '../../models/v1/user-models.mjs'

async function addUserGuest (req, reply) {
  try {
    const { _db } = this
    const { body } = req
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)

    const createdBy = 'system'
    const role = 'guest'

    const {
      email,
      firstName,
      lastName,
      passwordPlaintext,
      username
    } = sanitized

    const info = {
      createdBy,
      email,
      firstName,
      lastName,
      passwordPlaintext,
      role,
      username
    }
  
    const result = await newUser(_db, info)
    reply.send(result)
  } catch (error) {
    throw new Error(`User Controllers Add User Guest ${error}`)
  }
}

export { addUserGuest }
