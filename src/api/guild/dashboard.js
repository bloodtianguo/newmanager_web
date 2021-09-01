import request from '@/utils/request_guild'
// 获取数据展示
export function dataDisplay (params) {
  return request({
    url: '/plat/workbench/dataDisplay',
    method: 'get',
    params
  })
}
