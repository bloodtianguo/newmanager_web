import request from '@/utils/request_guild'
//公会获取打赏找票报表
export function guildStatisticsChart (params) {
  return request({
    url: '/plat/workbench/guildStatisticsChart',
    method: 'get',
    params
  })
}
