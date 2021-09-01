import qs from "qs";
import request from '@/utils/request';
// 获取订单列表
export function orderList (data) {
  return request({
    url: '/order/getOrderList',
    method: 'post',
    data
  })
}
// 后台充值

export function recharges(params) {
  return request({
    url: '/order/recharges',
    method: 'post',
    data:params,
    transformRequest: [function (data) {
      let ret = '';
      ret = qs.stringify(data, {
        arrayFormat: 'comma'
      });
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
