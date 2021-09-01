import request from '@/utils/request_guild'
//公会主播获取打赏找票排名
// sort 默认为"0" 倒序 "1"为正序
export function guildAnchorRank (params) {
  return request({
    url: '/plat/workbench/guildAnchorRank',
    method: 'get',
    params
  })
}
