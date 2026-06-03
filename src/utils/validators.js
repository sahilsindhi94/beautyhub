export function isValidName(value) {
  return typeof value === 'string' && value.trim().length >= 3
}

export function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(String(value).trim())
}

export function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value).trim())
}

export function isValidPincode(value) {
  return /^[1-9][0-9]{5}$/.test(String(value).trim())
}

export function isRequired(value) {
  return typeof value === 'string' && value.trim().length > 0
}
