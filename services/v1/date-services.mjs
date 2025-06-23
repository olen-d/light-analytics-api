import { format } from "mysql2"

const formatQueryDateTimeMySql = dateString => {
  if (dateString.includes('T')) {
    const elements = dateString.split('T')
    const formatted = elements.join(' ')
    return formatted
  } else {
    return dateString
  }
}

const formatUTCDate = (dateObj, formatString) => {
  switch (formatString) {
    case 'mySQLDate':
      const fullYear = dateObj.getUTCFullYear()
      const monthJs = dateObj.getUTCMonth() + 1
      const monthPadded = monthJs.toString().padStart(2, '0')
      const dayOfMonth = dateObj.getUTCDate().toString().padStart(2, '0')
      return `${fullYear}-${monthPadded}-${dayOfMonth}`
      break
  }
}

const getDateParts = (dateFormatted, format) => {
  let dateDay = 0
  let dateMonth = 0
  let dateYear = 0

  switch (format) {
    case 'dateString':
      const dateObj = new Date(dateFormatted)
      dateDay = dateObj.getDay()
      dateMonth = dateObj.getMonth()
      dateYear = dateObj.getFullYear()
    break
    default:
    case 'mysql':
      const [dateValue] = dateFormatted.split('T')
      [dateYear, dateMonth, dateDay] = dateValue.split('-')
    break
  }
  return [parseInt(dateYear), parseInt(dateMonth), parseInt(dateDay)]
}

const getDaysBetween = (startDate, endDate, format) => {
  const [endDateYear, endDateMonth, endDateDay] = getDateParts(endDate, format)
  const [startDateYear, startDateMonth, startDateDay] = getDateParts(startDate , format)

  const endDateJs = new Date(endDateYear, endDateMonth, endDateDay)
  const startDateJs = new Date(startDateYear, startDateMonth, startDateDay)

  const endDateTimestamp = parseInt(endDateJs.getTime() / 1000)
  const startDateTimestamp = parseInt(startDateJs.getTime() / 1000)

  const secondsDifference = endDateTimestamp - startDateTimestamp
  const daysDifference = secondsDifference / 60 / 60 / 24

  return daysDifference
}

const getPreviousPeriodDates = (startDate, endDate) => {
  const startDateJs = new Date(startDate)
  const endDateJs = new Date(endDate)

  const startDateTs = startDateJs.getTime()
  const endDateTs = endDateJs.getTime()

  const period = endDateTs - startDateTs

  const endDatePrevTs = startDateTs - 60000 * 60 * 24
  const startDatePrevTs = endDatePrevTs - period

  const endDatePrevJs = new Date(endDatePrevTs)
  const startDatePrevJs = new Date(startDatePrevTs)

  return { endDatePrevJs, startDatePrevJs }
}

export {
  formatQueryDateTimeMySql,
  formatUTCDate,
  getDateParts,
  getDaysBetween,
  getPreviousPeriodDates
}
