import { promises as dnsPromises } from 'dns'

const validateEmailAddress = async emailAddress => {
  const expression = /.+@.+\..+/i

  if (expression.test(String(emailAddress).toLowerCase())) {
    try {
      const hostname = emailAddress.split('@')[1]

      const addresses = await dnsPromises.resolveMx(hostname)

      return !!(addresses && addresses.length > 0 && addresses[0].exchange)
    } catch (error) {
      throw new Error(`Validate Services Validate Email Address ${error}`)
    }
  } else {
    return false
  }
}

const validateFirstName = firstName => {
  return new Promise((resolve, reject) => {
    try {
      const isValidLength = firstName.length >= 1

      const isValid = isValidLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateLastName = lastName => {
  return new Promise((resolve, reject) => {
    try {
      const isValidLength = lastName.length >= 1

      const isValid = isValidLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export {
  validateEmailAddress,
  validateFirstName,
  validateLastName,
}
