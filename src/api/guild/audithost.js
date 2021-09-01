import request from '@/utils/request_guild'
// 主播审核列表
export function anchorApplyRecordList(params) {
  return request({
    url: '/guild/getAnchorApplyRecordList',
    method: 'get',
    params
  })
}
// 主播审核
export function anchorAttAudit(params) {
  return request({
    url: '/guild/anchorAttAudit',
    method: 'post',
    params
  })
}
