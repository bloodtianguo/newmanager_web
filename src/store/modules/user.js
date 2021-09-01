import {
  login,
  logout,
  getInfo,
  getScanForInfo,
  getCreateScanData
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
// import _this from '@/main.js';
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    cityInfostate: '', //城市状态弹窗从哪儿来
    Seekinfostate: '', //找人找弹窗从哪儿来
    CityPopup: false, //添加城市弹窗控制
    SeekPopup: false, //添加找人找物弹窗控制
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 导航配置部分
  SET_Cityinfostate(state, val) {
    state.cityInfostate = val
  },
  SET_Seekinfostate(state, val) {
    state.Seekinfostate = val
  },
  //导航配置弹窗
  SET_CityPopup(state, val) {
    state.CityPopup = val
  },
  SET_SeekPopup(state, val) {
    state.SeekPopup = val
  }
}

const actions = {
  // 用户登录
  login({
    commit
  }, userInfo) {
    const {
      userName,
      passWord
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        userName: userName.trim(),
        passWord: passWord
      }).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        sessionStorage.name = response.data.name
        sessionStorage.userId = response.data.userId
        sessionStorage.avatar = response.data.avatar
        sessionStorage.account = response.data.account
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 扫码获取创建二维码时需要的字符串
  getScanStr() {
    return new Promise((resolve, reject) => {
      getCreateScanData().then(({
        data: {
          newManagerQrCode
        }
      }) => {
        resolve(newManagerQrCode)
      }).catch(err => {
        reject(err);
      })
    })
  },

  // 扫码登陆
  scanlogin({
    commit
  }, str) {
    return new Promise((resolve, reject) => {
      getScanForInfo(str).then(({
        data
      }) => {
        if (data.code == 1) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          sessionStorage.name = data.data.user.name
          sessionStorage.userId = data.data.userId
          sessionStorage.avatar = data.data.avatar
          sessionStorage.account = data.data.account
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },




  // 验证roken是否过期
  getInfo({
    commit,
    state
  }) {
    commit('SET_NAME', sessionStorage.name)
    commit('SET_AVATAR', sessionStorage.avatar)
    resolve(data)
  },
  // 用户登出
  logout({
    commit
  }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      sessionStorage.clear()
      resolve()
    })
  },
  // 移除token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  },
  // 导航配置部分
  setCityinfo({
    commit
  }, val) {
    commit('SET_Cityinfostate', val)
  },
  setSeekinfo({
    commit
  }, val) {
    commit('SET_Seekinfostate', val)
  },
  //导航配置弹窗
  setCityPopupval({
    commit
  }, val) {
    commit('SET_CityPopup', val)
  },
  setSeekPopupval({
    commit
  }, val) {
    commit('SET_SeekPopup', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
