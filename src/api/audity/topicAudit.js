import request from '@/utils/request'


// 话题审核
export function topicAuditAPI(params){
    return request({
        url:'/topic/topicAudit',
        method:'POST',
        params
    })
}

// 话题审核列表
export function topicAuditListAPI(params){
    return request({
        url:'/topic/topicAuditList',
        method:'POST',
        params
    })
}