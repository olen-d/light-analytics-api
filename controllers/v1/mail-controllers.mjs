import { mxExists } from '../../services/v1/mail-services.mjs'

const checkMx = async (req, reply) => {
  const { params: { email } } = req

  try {
    const result = await mxExists(email)
    return { status: 'ok', mxExists: result }
  } catch (error) {
    return {
      status: 'error',
      message: error,
      mxExists: false
    }
  }
}

export { checkMx }
