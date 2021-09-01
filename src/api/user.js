import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
//登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
// 扫码登陆:获取创建二维码数据
export function getCreateScanData() {
  return request({
    url: '/getCreateScanData?platform=newManager', // 获取新后台的权限数据
    method: 'post',
  })
}

// 扫码登陆：扫码轮询
export function getScanForInfo(data) {
  return request({
    url: '/getScanForInfo',
    method: 'post',
    transformRequest: [function () {
      var oMyForm = new FormData();
      oMyForm.append("code", data);
      return oMyForm;
    }],
  })
}
