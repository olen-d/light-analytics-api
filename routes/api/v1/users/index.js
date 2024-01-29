'use strict'

import { addUserGuest } from '../../../../controllers/v1/user-controllers.mjs'

export default async function (fastify, opts) {
  fastify.post('/guest', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addUserGuest)
}
