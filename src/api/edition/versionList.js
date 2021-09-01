import request from '@/utils/request_edition'

export function getversionList (params) {
  return request({
    url: '/versionList',
    method: 'get',
    params
  })
}
