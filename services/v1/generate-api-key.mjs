'use strict'
const { randomBytes } = await import('node:crypto')

const generateKey = () => {
  const key = randomBytes(32).toString('hex')
  return key
}
export { generateKey }
