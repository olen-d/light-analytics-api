import { Resolver } from 'dns/promises'

const resolver = new Resolver()

const mxExists = async emailAddress => {
  const hostname = emailAddress.split("@")[1]

  try {
    const addresses = await resolver.resolveMx(hostname)
    if (addresses && addresses.length > 0) {
      return addresses[0].exchange ? true : false
    }
  } catch (error) {
    // TODO: Deal with the error
    return false
  }
}

export { mxExists }
