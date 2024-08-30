import { createExcludedQueryParameters, readAllSettings} from '../../services/v1/setting-services.mjs'

const newExcludedQueryParameters = async (_db, info) => {
  try {
    const result = await createExcludedQueryParameters(_db, info)
    const status = await result[0].affectedRows === 1 ? 'ok' : 'error'
    const data = status === 'ok' ? { insertId: result[0].insertId } : result

    return { status, data }
  } catch (error) {
    throw new Error(`Setting Models New Excluded Query Parameters ${error}`)
  }
}

const getAllSettings = async _db => {
  try {
    const result = await readAllSettings(_db)

    const data = result === -99 ? [] : [...result]

    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Setting Models Get All Settings ${error}`)
  }
}

export { getAllSettings, newExcludedQueryParameters }
