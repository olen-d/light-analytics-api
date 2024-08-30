import { addExcludedQueryParameters, readAllSettings } from '../../../../controllers/v1/setting-controllers.mjs'
// TODO: Verify api key and JWT
export default async function (fastify, opts) {
  fastify.get('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, readAllSettings)
  fastify.post('/', { onRequest: fastify.auth([fastify.verifyAPIKey])}, addExcludedQueryParameters)
}
