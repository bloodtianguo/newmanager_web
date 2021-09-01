import request from '@/utils/request'

// 详情
export function detailsAPI(params){
    return request({
        url:'/shortVideo/details',
        method:'GET',
        params
    })
}

// 修改视频得分 /shortVideo/updateScore
export function updateScoreAPI(params){
    return request({
        url:'/shortVideo/updateScore',
        method:'POST',
        params
    })
}

// 修改视频得分 
export function reportDetailAPI(params){
    return request({
        url:'/shortVideo/reportDetail',
        method:'GET',
        params
    })
}