const processValidations = (fields, validations) => {
  return new Promise((resolve, reject) => {
    try {
      const validationResults = validations.map((element, index) => {
        if (element.status === 'rejected') {
          const { reason } = element
          return { inputName: fields[index], isValid: false, reason }
        } else {
          return { inputName: fields[index], isValid: element.value }
        }
      })
      resolve(validationResults)
    } catch (error) {
      reject(error)
    }
  })
}

export { processValidations }
