import request from '@/utils/request_guild'
// 公会获取打赏找票排名
// sort 默认为"0" 倒序 "1"为正序
export function guildRank (params) {
  return request({
    url: '/plat/workbench/guildRank',
    method: 'get',
    params
  })
}
