import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const UserName = 'userName'
const PassWord = 'passWord'
//储存token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 贮存使用账号
export function getName() {
  return Cookies.get(UserName)
}
export function setName(userName) {
  return Cookies.set(UserName, userName, {
    expires: 3
  })
}
export function removeName() {
  return Cookies.remove(UserName)
}
//贮存账号密码
export function getPwd() {
  return Cookies.get(PassWord)
}
export function setPwd(passWord) {
  return Cookies.set(PassWord, passWord, {
    expires: 3
  })
}
export function removePwd() {
  return Cookies.remove(PassWord)
}
