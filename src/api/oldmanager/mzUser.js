// request_old_manager
import request from '@/utils/request'

export function mzUserlist(params) {
  return request({
    url: '/api/mzUser/list',
    method: 'get',
    params
  })
}
