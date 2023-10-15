'use strict'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import AutoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'

import * as mysql from 'mysql2/promise'

import { geteKeyDomainScope }  from './models/v1/key-models.mjs'

import { hashKey } from './services/v1/hash-api-key.mjs'

export const options = {}

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyAuth)
  await fastify.register(cors, {
    'origin': process.env.ORIGIN_ALLOWED
  })
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const verifyKey = async( request, reply) => {
    try {
      const { headers: { 'api-key': apiKey, host }, method } = request

      if (!apiKey) {
        throw new Error('An API key must be supplied')
      }

      const _db = connection
      const hashedKey = hashKey(apiKey)
  
      const result = await geteKeyDomainScope(_db, { hashedKey })
      if (result.status !=='ok') {
        throw new Error('Invalid API key')
      } else {
        const { data: [{ scopes, domain }]} = result
        const re = new RegExp(`${domain}$`)
        const isValidHost = re.test(host)
        if (isValidHost) {
          const crosswalk = {
            'GET': 'read',
            'POST': 'write'
          }

          if (scopes.indexOf(crosswalk[method]) === -1) {
            throw new Error(`${method} is not authorized`)
          }
        } else {
          throw new Error(`${host} is not authorized`)
        }
      }
    } catch (error) {
      reply.code(401).send(error)
    }
  }

  fastify.decorate('_db', connection)
  fastify.decorate('verifyAPIKey', verifyKey)

  // Do not touch the following lines
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    // options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    // options: Object.assign({}, opts)
  })
}
