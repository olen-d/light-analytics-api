'use strict'

import {
  tokenBearerPublicKey,
  tokenGrantTypePassword,
  tokenGrantTypeRefreshToken
} from '../../../../controllers/v1/auth-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/token/bearer/public-key', { onRequest: fastify.auth([fastify.verifyAPIKey])}, tokenBearerPublicKey)
  fastify.put('/token/grant-type/password', { onRequest: fastify.auth([fastify.verifyAPIKey])}, tokenGrantTypePassword)
  fastify.post('/token/grant-type/refresh-token', { onRequest: fastify.auth([fastify.verifyAPIKey])}, tokenGrantTypeRefreshToken)
}
