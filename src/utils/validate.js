/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
  // const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号正则
  // return phoneReg.test(str)
}
export function validPhone(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
  const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号正则
  return phoneReg.test(str)
}
export function valid(str) {
  return phoneReg.test(str)
}
