'use strict'
import { addKey } from '../../../../controllers/v1/key-controllers.mjs'

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'keys'
  })
  fastify.get('/cheese', async function (request, reply) {
    return 'cheeseburger'
  })
  fastify.post('/', addKey)
}
