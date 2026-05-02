export const formatDateForFilename = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number)
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`
}

export const formatDateForDisplay = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number)
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

export const parseDisplayDate = (displayDate: string): string | null => {
  const match = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return null
  }
  return `${year}-${month}-${day}`
}
