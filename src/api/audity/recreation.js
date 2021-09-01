import request from '@/utils/request'

// 获取娱乐视频审核列表
export function getReVideoList(params){
    return request({
        url:'/audit/auditEntVideoList',
        method:'POST',
        params
    })
}
// 获取城市名片视频审核列表
export function getCityVideoList(params){
    return request({
        url:'/audit/auditCityVideoList',
        method:'POST',
        params
    })
}

// 获取打卡视频审核列表
export function getCardVideoList(params){
    return request({
        url:'/audit/auditPunchVideoList',
        method:'POST',
        params
    })
}
// 视频批量审核
export function auditVideo(params){
    return request({
        url:'/audit/auditVideobyGroup',
        method:'POST',
        params
    })
}
// 审核
export function auditOneVideo(params){
    return request({
        url:'/audit/auditVideo',
        method:'POST',
        params
    })
}