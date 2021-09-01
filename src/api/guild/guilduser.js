import request from '@/utils/request_guild'
// 公会端登录

export function login(data) {
    return request({
      url: '/guild/login',
      method: 'post',
      data
    })
  }
//登出
export function logout () {
  return request({
    url: '/guild/loginOut',
    method: 'post'
  })
}
// 获取短信验证码
export function guildVerify(data) {
  return request({
    url: '/guild/verify',
    method: 'get',
    data
  })
}
