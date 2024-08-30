const createExcludedQueryParameters = async (_db, info) => {
  const { name, value } = info

  try {
    const result = await _db.execute(
      'INSERT INTO settings (setting, value) VALUES (?,?)',
      [name, value]
    )
    return result
  } catch (error) {
    throw new Error(`Setting Services Create Excluded Query Parameters ${error}`)
  }

}

const readAllSettings = async _db => {
  try {
    const [rows, fields] = await _db.execute('SELECT setting, value FROM settings')
    if (rows && rows.length > 0) {
      return rows
    } else {
      return -99
    }
  } catch (error) {
    throw new Error(`Setting Services Read All Settings ${error}`)
  }
}

const updateExcludedQueryParameters = (_db, info) => {
  //
}

export {
  createExcludedQueryParameters,
  readAllSettings,
  updateExcludedQueryParameters
}
