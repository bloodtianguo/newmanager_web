import request from '@/utils/request';
export default {
  getTagList(params) { // 获取标签列表
    return request({
      url: 'tag/getTagList',
      method: 'post',
      params
    })
  },
  deleteTag(params) { // 删除标签
    return request({
      url: '/tag/deleteTag',
      method: 'post',
      params
    })
  },
  addTag(params) { // 添加标签
    return request({
      url: '/tag/addTag',
      method: 'post',
      params
    })
  },
  updateStatus(params) { // 修改标签状态
    return request({
      url: '/tag/updateStatus',
      method: 'post',
      params
    })
  },
  getEnableTagList(params) { // 获取启用的标签列表(视频打标签)
    return request({
      url: '/tag/getEnableTagList',
      method: 'post',
      params
    })
  },
  addTagsForVideo(params) { // 视频打标签
    return request({
      url: '/tag/addTagsForVideo',
      method: 'post',
      params
    })
  },

}
