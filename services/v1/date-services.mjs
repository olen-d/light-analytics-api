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

export { formatQueryDateTimeMySql, formatUTCDate, getPreviousPeriodDates }
