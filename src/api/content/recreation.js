import request from '@/utils/request'

//娱乐视频管理列表
export function videoListAPI(params){
    return request({
        url:'/shortVideo/entVideoList',
        method:'GET',
        params
    })
}

// 城市名片视频列表
export function cityVideoListAPI(params){
    return request({
        url:'/shortVideo/cityVideoList',
        method:'GET',
        params
    })
}
// 打卡视频
export function cardVideoListAPI(params){
    return request({
        url:'/shortVideo/punchVideoList',
        method:'GET',
        params
    })
}
// 拾金不昧
export function lostAndFoundVideoListAPI(params){
    return request({
        url:'/shortVideo/lostFoundVideoList',
        method:'GET',
        params
    })
}

// 视频上下架
export function updateShelvesAPI(params){
    return request({
        url:'/shortVideo/updateShelves',
        method:'POST',
        params
    })
}

// 批量下架
export function batchUpdateShelvesAPI(params){
    return request({
        url:'/shortVideo/batchUpdateShelves',
        method:'POST',
        params
    })
}

// 绑定为官方视频
export function addOfficealVideoAPI(params){
    return request({
        url:'/shortVideo/addOfficalVideo',
        method:'POST',
        params
    })
}