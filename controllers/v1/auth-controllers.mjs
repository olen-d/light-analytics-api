import { authenticateUser, getRefreshToken } from '../../models/v1/auth-models.mjs'
import { createRefreshToken, readPublicKeyTokenBearer } from '../../services/v1/auth-services.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input.mjs'
import { issueBearerToken, issueRefreshToken, verifyToken } from '../../services/v1/jsonwebtoken-services.mjs'
import { getUserRoleById } from '../../models/v1/user-models.mjs'

const tokenBearerPublicKey = async function (req, reply) {
  const publicKeyFile = process.env.JWT_PUBLIC_KEY_PEM_FILE
  const publicKey = readPublicKeyTokenBearer(publicKeyFile)

  if (publicKey) {
    reply.code(200).send({ status: 'ok', data: { publicKey } })
  }
}

const tokenGrantTypePassword = async function (req, reply) {
  try {
    const { ip: clientIp } = req

    const algorithm = process.env.JWT_ALGORITHM
    const audience = process.env.JWT_AUDIENCE
    const clientId = process.env.CLIENT_ID
    const issuer = process.env.JWT_ISSUER
    const privateKeyFile = process.env.JWT_PRIVATE_KEY_PEM_FILE
    const refreshtokenAudience = process.env.RT_AUDIENCE
    const refreshTokenPrivateKeyFile = process.env.RT_PRIVATE_KEY_PEM_FILE

    const { _db } = this
    const { body } = req
  
    const trimmed = trimAll(body)
    const sanitized = sanitizeAll(trimmed)
  
    const { plaintextPassword, username } = sanitized
  
    const info = {
      plaintextPassword,
      username
    }
  
    const result = await authenticateUser(
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
    )
    const { status } = result
  
    if (status === 'ok') {
      const { data: { refreshToken }, } = result
  
      const expiration = new Date()
      expiration.setDate(expiration.getDate() + 30)
  
      const options = {
        expires: expiration,
        httpOnly: true,
        path: '/',
        secure: true
      }
      reply.code(201).setCookie('refreshToken', refreshToken, options).send(result)
    } else if (status === 'error') {
      const { type } = result
      switch (type) {
        case 'database':
          reply.code(503).send(result)
          break
        case 'jsonwebtoken':
          reply.code(503).send(result)
          break
        case 'not found':
          reply.code(404).send(result)
          break
        case 'validation':
          reply.code(400).send(result)
          break
        default:
          reply.code(503).send(result)
      }
    }
  } catch (error) {
    throw new Error(`Auth Controllers Token Grant Type Password ${error}`)
  }
}

const tokenGrantTypeRefreshToken = async function (req, reply) {
  try {
    const cookieRefreshToken = req?.cookies?.refreshToken // In case users have cookies disabled
    const { _db } = this

    const {
      body,
      headers: { referer, 'user-agent': userAgent }, 
      ip: clientIp
    } = req

    const bodyParsed = JSON.parse(body)
    const trimmed = trimAll(bodyParsed)
    const sanitized = sanitizeAll(trimmed)
    const { refreshToken: refreshTokenValue } = sanitized

    const refreshToken = refreshTokenValue === 'none' && cookieRefreshToken ? cookieRefreshToken : refreshTokenValue

    const audience = process.env.JWT_AUDIENCE
    const algorithm = process.env.JWT_ALGORITHM
    const issuer = process.env.JWT_ISSUER
    const refreshTokenPublicKeyFile = process.env.RT_PUBLIC_KEY_PEM_FILE

    const verifyTokenResult = await verifyToken(
      refreshToken,
      refreshTokenPublicKeyFile,
      algorithm,
      issuer
    )

    const { aud: clientId, sub: userId } = verifyTokenResult

    if ( clientId !== audience ) {
      throw new Error(`Auth Controllers Token Grant Type Refresh Token Invalid Audience`)
    }

    const clientName = clientId.split('://')[1] // discard http(s)://
    const refererValue = userAgent === 'node-fetch' || 'undici' ? process.env.CLIENT_ID : referer
    const refererName = refererValue.split("://")[1].split("/")[0]; // discard http(s):// and anything after the top level domain

    if (clientName === refererName) {
      const result = await getRefreshToken(_db, userId, refreshToken, clientIp)
      if (result?.status === 'ok' && result.data?.length > 0) {
        const accessTokenPrivateKeyFile = process.env.JWT_PRIVATE_KEY_PEM_FILE
        const refreshTokenAudience = process.env.RT_AUDIENCE
        const refreshTokenPrivateKeyFile = process.env.RT_PRIVATE_KEY_PEM_FILE

        const info = { userId }
        const userData = await getUserRoleById(_db, info)
        const { data: [{ role }] } = userData
        const accesstokenExpires = '1h'
        const refreshTokenExpires = '30d'

        const newAccessToken = await issueBearerToken(
          algorithm,
          audience,
          accesstokenExpires,
          issuer,
          accessTokenPrivateKeyFile,
          role,
          userId
        )

        const newRefreshToken = await issueRefreshToken(
          algorithm,
          refreshTokenAudience,
          clientId,
          refreshTokenExpires,
          issuer,
          refreshTokenPrivateKeyFile,
          userId
        )

        if (newRefreshToken) {
          const info = {
            userId,
            refreshToken: newRefreshToken,
            clientIp
          }
          const result = await createRefreshToken(_db, info)
          const [{ affectedRows }] = result

          if (affectedRows !== 1) {
            return { status: 'error', type: 'database', message: 'unable to insert refresh token' }
          } else {
            const response = {
              status: 'ok',
              data: {
                tokenType: 'bearer',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
              }
            }
            const expiration = new Date()
            expiration.setDate(expiration.getDate() + 30)
        
            const options = {
              expires: expiration,
              httpOnly: true,
              path: '/',
              secure: true
            }
            reply.code(201).setCookie('refreshToken', newRefreshToken, options).send(response)
          }
        } else {
          return { status: 'error', type: 'jsonwebtoken', message: 'unable to create refresh token' }
        }
      } else {
        return { status: 'error', type: 'jsonwebtoken', message: 'refresh token not found, unable to create refresh token' }
      }
    } else {
      return { status: 'error', type: 'jsonwebtoken', message: 'client and referrer mismatch, unable to create refresh token' }
    }
  } catch (error) {
    throw new Error(`Auth Controllers Token Grant Type Refresh Token ${error}`)
  }
}

export { tokenBearerPublicKey, tokenGrantTypePassword, tokenGrantTypeRefreshToken }
