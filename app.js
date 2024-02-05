'use strict'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import AutoLoad from '@fastify/autoload'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'

import * as mysql from 'mysql2/promise'

import { geteKeyDomainScope }  from './models/v1/key-models.mjs'

import { hashKey } from './services/v1/hash-api-key.mjs'

export const options = {}

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyCookie)
  fastify.register(fastifyAuth)
  const originsAllowed = process.env.ORIGIN_ALLOWED.split(',')

  await fastify.register(cors, {
    'credentials': true,
    'origin': originsAllowed
  })
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  })

  const verifyKey = async( request, reply) => {
    try {
      const { headers: { 'api-key': apiKey, origin, host }, method } = request
      const hostname = origin ? origin.replace(/^https?\:\/\//i, '') : host

      if (!apiKey) {
        throw new Error('An API key must be supplied')
      }

      const _db = pool
      const hashedKey = hashKey(apiKey)
  
      const result = await geteKeyDomainScope(_db, { hashedKey })
      if (result.status !=='ok') {
        throw new Error('Invalid API key')
      } else {
        const { data: [{ scopes, domain }]} = result
        const re = new RegExp(`${domain}$`)
        const isValidHost = re.test(hostname)
        if (isValidHost) {
          const crosswalk = {
            'GET': 'read',
            'POST': 'write',
            'PUT': 'write'
          }

          if (scopes.indexOf(crosswalk[method]) === -1) {
            throw new Error(`${method} is not authorized`)
          }
        } else {
          throw new Error(`${hostname} is not authorized`)
        }
      }
    } catch (error) {
      reply.code(401).send(error)
    }
  }

  fastify.decorate('_db', pool)
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
