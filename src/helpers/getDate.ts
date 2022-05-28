import { ParsedEvent } from "../colony/types"

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const getDateString = (event: ParsedEvent) => {
  const { logTime } = event
  const date = logTime && new Date(logTime)
  if (!date) return ''
  return `${('0' + date.getDate()).slice(-2)} ${MONTHS[date.getMonth()]}`
}

export default getDateString
