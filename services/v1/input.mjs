const sanitizeAll = obj => {
  if (obj instanceof Object) {
    const re = /^\$/
    for (const key in obj)  {
      if ( re.test(key)) {
        delete obj[key]
      } else {
        sanitizeAll(obj[key])
      }
    }
  }
  return obj
}

const trimAll = obj => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim()
    } else if (typeof obj[key] === 'object' && !(obj[key] instanceof Array)) {
      trimAll(obj[key])
    }
  }
  return obj
}

export { sanitizeAll, trimAll }
