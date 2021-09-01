import request from '@/utils/request';
export default {
  getUser(params) { // 获取用户统计
    return request({
      url: '/statistics/user',
      method: 'get',
      params
    })
  },
  userChart(params) { // 获取用户统计图
    return request({
      url: `/statistics/user/${params.type}`,
      method: 'get',
      params
    })
  },
  getVideo(params) { // 获取视频统计
    return request({
      url: '/statistics/video',
      method: 'get',
      params
    })
  },
  videoChart(params) { // 获取视频统计图
    return request({
      url: `/statistics/video/${params.type}`,
      method: 'get',
      params
    })
  },
  getTransaction(params) { // 获取交易统计
    return request({
      url: '/statistics/transaction',
      method: 'get',
      params
    })
  },
  dealChart(params) { // 获取交易统计图
    return request({
      url: `/statistics/transaction/${params.type}`,
      method: 'get',
      params
    })
  },

}
