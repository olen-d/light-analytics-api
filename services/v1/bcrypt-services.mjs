import{ compare, hash } from 'bcrypt'

const saltRounds = 10

const checkPassword = async (plainTextPassword, passwordHash) => {
  try {
    const result = await compare(plainTextPassword, passwordHash)
    return result
  } catch (error) {
    throw new Error(`Bcrypt Services Check Password ${error}`)
  }
}

const hashPassword = async plainTextPassword => {
  try {
    const result = await hash(plainTextPassword, saltRounds)
    return result
  } catch (error) {
    throw new Error(`Bcrypt Services Hash Password ${error}`)
  }
}

export { checkPassword, hashPassword}
