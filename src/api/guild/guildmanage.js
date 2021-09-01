import request from '@/utils/request_guild'
// 公会管理列表
export function guildList(params) {
  return request({
    url: '/plat/guild/list',
    method: 'get',
    params
  })
}
// 公会详情
export function guildDetail(params) {
  return request({
    url: '/plat/guild/queryDetail',
    method: 'get',
    params
  })
}
//添加公会
export function guildAdd(params) {
  return request({
    url: '/plat/guild/add',
    method: 'post',
    params
  })
}
// 公会清退
export function guildClear(params) {
  return request({
    url: '/plat/guild/guildClear',
    method: 'post',
    params
  })
}
// 修改公会信息
export function updateGuild(params) {
  return request({
    url: '/plat/guild/updateGuild',
    method: 'post',
    params
  })
}
// 主播管理列表
export function anchorList(params) {
  return request({
    url: '/plat/anchor/list',
    method: 'get',
    params
  })
}
// 主播详情
export function anchorDetail(params) {
  return request({
    url: '/plat/anchor/detail',
    method: 'get',
    params
  })
}
