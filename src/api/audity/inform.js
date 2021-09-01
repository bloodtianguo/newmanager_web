import request from '@/utils/request'

// 举报审核列表
export function informListAPI(params){
    return request({
        url:'/report/reportAuditList',
        method:'POST',
        params
    })
}

// 举报详情   /report/auditDetail
export function informDetailsAPI(params){
    return request({
        url:'/report/auditDetail',
        method:'POST',
        params
    })
}


// 审核内容  /report/auditReport
export function auditReportAPI(params){
    return request({
        url:'/report/auditReport',
        method:'POST',
        params
    })
}