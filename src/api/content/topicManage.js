import request from '@/utils/request'

// 话题列表
export function topicListAPI(params){
    return request({
        url:'/shortVideo/topicList',
        method:'GET',
        params
    })
}
// 话题下架
export function removeTopicAPI(data){
    return request({
        url:'/shortVideo/removeTopic',
        method:'POST',
        data
    })
}

// 绑定官方
export function bindOfficalAPI(params){
    return request({
        url:'/shortVideo/bindOffical',
        method:'GET',
        params
    })
}
// 解绑
export function outOfBindAPI(params){
    return request({
        url:'/shortVideo/outOfBind',
        method:'GET',
        params
    })
}