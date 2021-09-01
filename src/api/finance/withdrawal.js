import request from '@/utils/request';
// 获取提现列表
export function withdrawalList(data) {
  return request({
    url: '/withdrawal/getWithdrawalList',
    method: 'post',
    data
  })
}
// 系统云打款
export function systemPay(params) {
  return request({
    url: '/withdrawal/systemPay',
    method: 'post',
    params
  })
}

// 人工支付
export function artificialPay(params) {
  return request({
    url: '/withdrawal/artificialPay',
    method: 'post',
    params
  })
}

// 拒绝支付
export function refusePay(params) {
  return request({
    url: '/withdrawal/refusePay',
    method: 'post',
    params
  })
}

// 取消云打款
export function cancelSystemPay(params) {
  return request({
    url: '/withdrawal/cancelSystemPay',
    method: 'post',
    params
  })
}
