import { readUserByUsername } from './user-services.mjs'

const validatePassword = password => {
  return new Promise((resolve, reject) => {
    try {
      const oneUpper = /[A-Z]/
      const oneLower = /[a-z]/
      const oneDigit = /\d/
      const oneSpecial = /[!@#$%^&*()-+=]/

      const isOneUpper = oneUpper.test(password)
      const isOneLower = oneLower.test(password)
      const isOneDigit = oneDigit.test(password)
      const isOneSpecial = oneSpecial.test(password)
      const isLength = password.length >= 8

      const isValid = isOneUpper && isOneLower && (isOneDigit || isOneSpecial) && isLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateRole = role => {
  return new Promise((resolve, reject) => {
    const roles = ['administrator', 'editor', 'guest', 'superadmin', 'user']
    try {
      const index = roles.indexOf(role)

      const isValid = index !== -1
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateUsername = username => {
  return new Promise((resolve, reject) => {
    try {
      const alphaNumeric = /^[a-z0-9\-_.]+$/
  
      const isValid = alphaNumeric.test(username)
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateUsernameUnique = async (_db, username) => {
  try {
    const response = await readUserByUsername(_db, { username })
    const isUnique = response === false
    const alphaNumeric = /^[a-z0-9\-_.]+$/

    const isValid = isUnique && alphaNumeric.test(username)
    return isValid
  } catch (error) {
    throw new Error(error)
  }
}

export { validatePassword, validateRole, validateUsername, validateUsernameUnique }
