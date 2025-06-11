import { v4 as uuidv4 } from 'uuid'

// Useful for items that come back from the database without an id, e.g. anything resulting from a GROUP BY
const addUniqueIds = data => {
  const dataWithUniqueIds = data.map(element => {
    return Object.assign({ id: uuidv4()}, element)
  })
  return dataWithUniqueIds
}

export { addUniqueIds }
