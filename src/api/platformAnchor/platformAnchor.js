import request from '@/utils/request'

// 主播管理
export function liveBroadListAPI(params){
    return request({
        url:'/liveBroadcastInfo/anchorManagement/liveBroadList',
        method:'POST',
        params
    })
}

// 主播基本信息
export function anchorInfoListAPI(params){
    return request({
        url:'/liveBroadcastInfo/anchorBasicInfo/platAnchorInfoList',
        method:'POST',
        params
    })
}

// 直播间管理  主播直播场次列表  
export function liveEventsListAPI(params){
    return request({
        url:'/liveBroadcastInfo/liveRoom/liveRoomInfoList',
        method:'POST',
        params
    })
}


// 主播直播详情 
export function liveBroadcastInfoDetailsAPI(params){
    return request({
        url:'/liveBroadcastInfo/anchorManagement/liveBroadcastInfoDetails',
        method:'POST',
        params
    })
}
// 直播历史记录  
export function liveHistoryAPI(params){
    return request({
        url:'/liveBroadcastInfo/anchorManagement/liveEventsList',
        method:'POST',
        params
    })
}

// 数据统计 打赏数据 
export function statisticsAPI(params){
    return request({
        url:'/liveBroadcastInfo/DataStatistical/liveRewardInfoList',
        method:'POST',
        params
    })
}
// 数据统计  
export function dataCountAPI(params){
    return request({
        url:'/liveBroadcastInfo/DataStatistical/dataCount',
        method:'POST',
        params
    })
}



//  禁播
export function banLiveAPI(params){
    return request({
        url:'liveBroadcastInfo/ban/banLive',
        method:'POST',
        params
    })
}

//  解禁
export function relieveLiveAPI(params){
    return request({
        url:'/liveBroadcastInfo/ban/relieveLive',
        method:'POST',
        params
    })
}