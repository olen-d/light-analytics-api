'use strict'

import * as fs from 'fs'

const readPublicKeyTokenBearer = publicKeyFile => {
  try {
    const publicKey = fs.readFileSync(publicKeyFile)
    return publicKey
  } catch (error) {
    throw new Error(`Auth Services Read Public Key Token Bearer ${error}`)
  }
}

export { readPublicKeyTokenBearer }
