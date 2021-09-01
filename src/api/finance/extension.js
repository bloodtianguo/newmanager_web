import request from '@/utils/request';

// 搜索推广收益明细
export function marketProfits (data) {
  return request({
    url: '/market/getMarketProfits',
    method: 'post',
    data
  })
}
