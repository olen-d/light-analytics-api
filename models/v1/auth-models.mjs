import { createRefreshToken, readRefreshToken } from '../../services/v1/auth-services.mjs'
import { checkPassword } from '../../services/v1/bcrypt-services.mjs'
import { issueBearerToken, issueRefreshToken } from '../../services/v1/jsonwebtoken-services.mjs'
import { readUserPasswordHash, readUserRole  } from '../../services/v1/user-services.mjs'
import { processValidations } from '../../services/v1/process-validation-services.mjs'
import { validatePassword, validateUsername } from '../../services/v1/validate-user-services.mjs'

const authenticateUser = async (
    _db,
    algorithm,
    audience,
    clientId,
    clientIp,
    info,
    issuer,
    privateKeyFile,
    refreshtokenAudience,
    refreshTokenPrivateKeyFile
) => {
    const {
      plaintextPassword,
      username: usernameRaw
    } = info

    const username = usernameRaw.toLowerCase()
  
    const isValidPassword = validatePassword(plaintextPassword)
    const isValidUsername = validateUsername(username)
  
    const fields = ['plaintextPassword', 'username'] // These need to be in the same order as Promise.allSettled on the next line
    const validations = await Promise.allSettled([isValidPassword, isValidUsername])
  
    // Loop through validations
    const validationResults = await processValidations(fields, validations)
    const foundValidationError = validationResults.findIndex((element) => {
      if (element.isValid === false) { return true }
    })
  
    if (foundValidationError === -1) {
      const notFoundErrorObject = { status: 'error', type: 'not found', message: 'username or password could not be found' }
  
      const infoValidated = { username }
      const data = await readUserPasswordHash(_db, infoValidated)
  
      // Return not found if the username wasn't found
      if (!data) { return notFoundErrorObject }
  
      const [{ password_hash: passwordHash }] = data

      const isAuthenticated = await checkPassword(plaintextPassword, passwordHash)
      // If is authenticated, then get the user role and issue a token
      if (isAuthenticated) {
        // Get the user role
        const data = await readUserRole(_db, infoValidated)

        const expiresIn = '1h'
        const refreshTokenExpiresIn = '5d'
        const [{ id, role }] = data

        const userId = id.toString()

        const accessToken = await issueBearerToken(algorithm, audience, expiresIn, issuer, privateKeyFile, role, userId)
        const refreshToken = await issueRefreshToken(algorithm, refreshtokenAudience, clientId, refreshTokenExpiresIn, issuer, refreshTokenPrivateKeyFile, userId)
        if (refreshToken) {
          const newRefreshToken = {
            userId,
            refreshToken,
            clientIp
          }
          const data = await createRefreshToken(_db, newRefreshToken)
          const [{ affectedRows }] = data
          if (affectedRows < 1) {
            return { status: 'error', type: 'database', message: 'unable to insert refresh token' }
          }
        } else {
          return { status: 'error', type: 'jsonwebtoken', message: 'unable to create refresh token' }
        }
        return { status: 'ok', data: { tokenType: 'bearer', accessToken, refreshToken } }
      } else {
        return notFoundErrorObject
      }
    } else {
      return { status: 'error', type: 'validation', message: 'one or more values could not be validated', validationResults }
    }
  }

const getRefreshToken = async (_db, userId, refreshToken, ipAddress) => {
  try {
    const data = await readRefreshToken(_db, userId, refreshToken, ipAddress)
    return { status: "ok", data }
  } catch (error) {
    return { status: 'error', type: 'database', message: 'unable to read refresh token', error }
  }
}

export { authenticateUser, getRefreshToken }
