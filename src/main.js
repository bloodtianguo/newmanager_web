import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import animate from 'animate.css'
import particlesJs from "particles.js" //引入粒子效果
import {
  getchtime2,
  getchtime
} from './utils/tools/format-time.js'; //时间格式化函数
import {
  switchtypeVal,
  changeVal
} from './utils/tools/switchval.js' //根据后端返回的主播类型数字转换对应的汉字
import {
  sortFunallrise,
  sortFunalldrop
} from "./utils/tools/sortdata";
import {
  Success,
  Infos,
  Warning
} from '@/utils/tools/message.js';
import selectexeport from "@/components/selectexeport.vue"; //引入导出勾选组件

// import adaptation from "@/utils/tools/adaptation" //1920x1080 缩放 测试
//引入echart
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import '@/icons'
import '@/permission'
/*--------------------------------------------*/

import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
Vue.use(QuillEditor) //富文本
/*--------------------------------------------*/
Vue.use(ElementUI)
Vue.use(particlesJs)
Vue.use(animate)
Vue.config.productionTip = false
Vue.component("selectexeport", selectexeport) //全局注册 勾选导出组件
// Vue.use(adaptation)//1920x1080 缩放 测试
/*--------------------------------暂时需要更改----------------------------------*/
Vue.prototype.req = request
import request from '@/utils/request_edition'
/*----------------------------监听--------------------------------*/
Vue.prototype.changedata = getchtime2; //格式化时间 带秒数
Vue.prototype.changedatano = getchtime; //格式化时间 不带秒数

Vue.prototype.Success = Success; //成功消息提示
Vue.prototype.Warning = Warning; //警告消息提示
Vue.prototype.Infos = Infos; //普通消息提示
Vue.prototype.switchtypeVal = switchtypeVal; //转换主播类型
Vue.prototype.changeVal = changeVal;
Vue.prototype.sortFunallrise = sortFunallrise; //前端表格列表手动排序(升序)
Vue.prototype.sortFunalldrop = sortFunalldrop; //前端表格列表手动排序(降序)
/**
 * @description
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2019-05-29
 * @param { number } type 1 localStorage 2 sessionStorage
 * @param { string } key 键
 * @param { string } data 要存储的数据
 * @returns
 */
Vue.prototype.$addStorageEvent = function (type, key, data) {
  if (type === 1) {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  } else {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  }
}
/*------------------------------------------------------------------*/
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
