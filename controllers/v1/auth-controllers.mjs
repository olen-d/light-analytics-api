'use strict'

import { readPublicKeyTokenBearer } from '../../services/v1/auth-services.mjs'

const tokenBearerPublicKey = async function (req, reply) {
  const publicKeyFile = process.env.JWT_PUBLIC_KEY_PEM_FILE
  const publicKey = readPublicKeyTokenBearer(publicKeyFile)

  if (publicKey) {
    reply.code(200).send({ status: 'ok', data: { publicKey } })
  }
}

export { tokenBearerPublicKey }
