function validateDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) {
    return false
  }

  if (isNaN(Date.parse(dateString))) {
    return false
  }

  const year = parseInt(dateString.split('-')[0])
  if (year < 1900 || year > 2100) {
    return false
  }
  return true
}

export { validateDate }
