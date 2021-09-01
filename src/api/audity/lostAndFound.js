import request from '@/utils/request'

// 拾金不昧审核列表
export function getLostFoundList(params){
    return request({
        url:'/lostFound/lostFoundAuditList',
        method:'POST',
        params
    })
}

// 根据拾金不昧数据id查询改id数据的详细信息
export function getDetailsById(params){
    return request({
        url:'/lostFound/lostFoundDetail',
        method:'GET',
        params
    })
}

// 拾金不昧申请记录
export function getFoundHistory(params){
    return request({
        url:'/lostFound/listLostFoundHistory',
        method:'GET',
        params
    })
}

// 通过或拒绝审核
export function  foundAudit(params){
    return request({
        url:"/lostFound/lostFoundAudit",
        method:'POST',
        params
    })
}

// 拾金不昧历史详情
export function getHistoryDetails(params){
    return request({
        url:'/lostFound/lostFoundHistoryDetail',
        method:'GET',
        params
    })
}