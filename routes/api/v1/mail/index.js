'use strict'
import { checkMx } from '../../../../controllers/v1/mail-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/check-mx/:email', { onRequest: fastify.auth([fastify.verifyAPIKey])}, checkMx)
}
