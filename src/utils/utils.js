export const checkRequiredFields = (jsonObj, requiredFields) => {
    for (const field of requiredFields) {
      if (!(field in jsonObj)) {
        return false; // Missing a required field
      }
    }
    return true; // All required fields are present
}

export const bookingRequiredFields = ['userId', 'finish_at']

export const checkDate = (date) => {
    const userDate = new Date(date)

    const isValidDate = !isNaN(userDate) && userDate instanceof Date;
    if (isValidDate) {
        return true
    }
    return false
}