'use strict'
const { createHash } = await import('node:crypto')

const hashKey = key => {
  const hash = createHash('sha256')
  hash.update(key)
  return hash.digest('hex')
}

export { hashKey }
