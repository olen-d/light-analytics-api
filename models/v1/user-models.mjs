import { createUser, readUserRoleById } from '../../services/v1/user-services.mjs'
import { hashPassword } from '../../services/v1/bcrypt-services.mjs'
import { processValidations } from '../../services/v1/process-validation-services.mjs'
import { validateEmailAddress, validateFirstName, validateLastName } from '../../services/v1/validate-services.mjs'
import { validatePassword, validateRole, validateUsernameUnique } from '../../services/v1/validate-user-services.mjs'

const getUserRoleById = async (_db, info) => {
  try {
    const data = await readUserRoleById(_db, info)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`User Models Get User Role By Id ${error}`)
  }
}

const newUser = async (_db, info) => {
  try {
    const {
      createdBy,
      email,
      firstName,
      lastName,
      passwordPlaintext,
      role,
      username: usernameRaw
    } = info

    const username = usernameRaw.toLowerCase()

    const isValidEmailAddress = validateEmailAddress(email)
    const isValidFirstName = validateFirstName(firstName)
    const isValidLastName = validateLastName(lastName)
    const isValidPassword = validatePassword(passwordPlaintext)
    const isValidRole = validateRole(role)
    const isValidUsername = validateUsernameUnique(_db, username)
  
    const validations = await Promise.allSettled([isValidEmailAddress, isValidFirstName, isValidLastName, isValidPassword, isValidRole, isValidUsername])
    const fields = ['emailAddress', 'firstName', 'lastName', 'passwordPlaintext', 'role', 'username'] // These need to be in the same order as Promise.allSettled above
  
    const validationResults = await processValidations(fields, validations)
    const foundValidationError = validationResults.findIndex((field) => {
      if (field.isValid === false) { return true }
    })

    if (foundValidationError === -1) {
      const passwordHash = await hashPassword(passwordPlaintext)
  
      if (passwordHash) {
        const infoValidated = {
          createdBy,
          email,
          firstName,
          lastName,
          passwordHash,
          role,
          username,
        }

        const result = await createUser(_db, infoValidated)
        const status = await result[0].affectedRows === 1 ? 'ok' : 'error'
        const data = status === 'ok' ? { insertId: result[0].insertId } : result

        return { status, data }
      }
    } else {
      return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
    }
  } catch (error) {
    throw new Error(`User Models New User ${error}`)
  }
}

export { getUserRoleById, newUser }
