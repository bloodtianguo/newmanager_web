import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
let baseurl = process.env.VUE_APP_BASEAPI_COMMON
const service = axios.create({
  baseURL: baseurl, //默认接口地址
  timeout: 30000,
})
// 图片上传地址
export var ITEMS_UP_IMG = baseurl + "/upload/uploadFile"
export var UPDATE_VIDEO_COVER = baseurl + "/shortVideo/updateVideoCover"
service.interceptors.request.use(config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error, "错误") // for debug
    return Promise.reject(error)
  }
)

// response interceptor 修改 层级格式
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== "0") {
      // 以下code根据实际接口做修改
      if (res.code === "-1" && res.msg.includes("token")) {
        MessageBox.confirm('您已注销，请重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.msg == '账号不存在' || res.msg == '密码输入错误,请重试' || res.msg == '你不是超级管理员请使用扫码登录') {
        return Promise.reject(res.msg)
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
          center: true
        })
      }
      return Promise.reject(new Error(res.msg || '错误!'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000,
      center: true
    })
    return Promise.reject(error)

  }
)

export default service
