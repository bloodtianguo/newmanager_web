import request from '@/utils/request_guild'
// 公会结算列表
export function guildSettlementlist(params) {
  return request({
    url: '/plat/statistics/settleList',
    method: 'post',
    params
  })
}
// 公会结算详情列表
export function guildSettlementdetail(params) {
  return request({
    url: '/plat/statistics/settleInfoList',
    method: 'post',
    params
  })
}
// 主播结算列表
export function anchorSettlementlist(params) {
  return request({
    url: '/plat/statistics/settlementList',
    method: 'get',
    params
  })
}
// 主播结算详情列表
export function anchorSettlementdetail(params) {
  return request({
    url: '/plat/statistics/settlementInfoList',
    method: 'get',
    params
  })
}
