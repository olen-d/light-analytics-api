'use strict'

import { tokenBearerPublicKey } from '../../../../controllers/v1/auth-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/token/bearer/public-key', { onRequest: fastify.auth([fastify.verifyAPIKey])}, tokenBearerPublicKey)
}
