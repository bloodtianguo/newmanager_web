<template>
  <div class="login-container">
    <div class="left-cont">
      <p>欢迎来到</p>
      <p>没找APP后台管理系统</p>
    </div>
    <div class="right-cont-scan" v-show="loginMode == 1">
      <p style="margin-top: 30px">二维码登录</p>
      <div class="scan">
        <div ref="qrCode" id="qrCode" class="scan-can"></div>
        <div class="overtimeTip" v-show="qrOverTime" @click="refreshQr">
          <p>二维码失效</p>
          <p>请点击刷新</p>
        </div>
      </div>
      <div class="tips">
        <p>打开没找APP点击"扫一扫"</p>
        <p>扫码二维码登录</p>
      </div>
      <div class="super-admin" @click="cutLoginMode(2)">超级管理员登录</div>
    </div>
    <div class="right-cont-login" v-show="loginMode == 2">
      <p style="margin-top: 30px">超级管理员登录</p>
      <div class="username">
        <input
          type="text"
          placeholder="请输入账号"
          v-model.trim="userName"
          @focus="errShowHandler"
        />
      </div>
      <div class="pwd">
        <input
          type="password"
          placeholder="请输入密码"
          v-model="pwd"
          @focus="errShowHandler"
        />
      </div>
      <div class="remember">
        <input type="checkbox" name="" id="remember1" v-model="isRemember" />
        <label for="remember1">记住密码</label>
      </div>
      <div class="err-tip">
        <span>{{ errorMeg }}</span>
      </div>
      <button
        class="loginbtn"
        :style="isLogin ? 'background:#5C8EFF;' : ''"
        :disabled="isLogin ? false : true"
        @click="loginHandler"
      >
        登录
      </button>

      <div class="super-admin" @click="cutLoginMode(1)">扫码登录</div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { Message } from "element-ui";
import {
  getName,
  setName,
  removeName,
  getPwd,
  setPwd,
  removePwd,
} from "@/utils/auth";
import { Base64 } from "js-base64";
let setRemUnit;
let pageshow;
let rem;
function setRem(window, document) {
  let docEl = document.documentElement;
  // set 1rem = viewWidth / 10
  setRemUnit = function () {
    if (docEl.clientWidth < 1200) return;
    rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  };
  pageshow = function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  };
  setRemUnit();
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", pageshow);
}
export default {
  name: "Login",
  data() {
    return {
      loginMode: 1, // 登陆方式，1：扫码 2：密码
      userName: "",
      pwd: "",
      isRemember: true, // 是否记住密码
      qrOverTime: true, // 表示二维码是否超时
      errorMeg: "", // 错误提示
      errShow: false,
    };
  },
  created() {
    this.time = 0; // 定时器
    this.scanStr = ""; // 生成二维码需要的字符串
  },
  beforeMount() {
    setRem(window, document);
  },
  mounted() {
    this.createScan();
  },
  beforeDestroy() {
    window.removeEventListener("resize", setRemUnit);
    window.removeEventListener("pageshow", pageshow);
    document.documentElement.style.fontSize = "";
  },
  methods: {
    // 登陆方式切换
    cutLoginMode(e) {
      this.loginMode = e;
      if (e == 1) {
        this.createScan();
      } else {
        clearTimeout(this.time);
        this.getfrom();
      }
    },
    // 验证并填入账号密码
    getfrom() {
      if (getName() && getPwd()) {
        this.isRemember = true;
        this.userName = this.debase64Fun(getName());
        this.pwd = this.debase64Fun(getPwd());
      }
    },
    // base64转码加密
    base64Fun(val) {
      var base64Val = Base64.encode(val);
      return base64Val;
    },
    // base64转码解密
    debase64Fun(val) {
      var deBase64Val = Base64.decode(val);
      return deBase64Val;
    },

    loginHandler() {
      this.$store
        .dispatch("user/login", { userName: this.userName, passWord: this.pwd })
        .then(() => {
          // 判断是否选择记住密码
          if (this.isRemember) {
            setName(this.base64Fun(this.userName));
            setPwd(this.base64Fun(this.pwd));
          } else {
            removeName();
            removePwd();
          }
          this.$router.push({ path: "/data" });
        })
        .catch((error) => {
          this.errorMeg = error;
        });
    },

    // 刷新二维码
    refreshQr() {
      this.scanStr = "";
      this.createScan();
    },

    // 生成二维码
    async createScan() {
      // 生成二维码所需要的字符串
      if (this.scanStr == "") {
        try {
          this.scanStr = await this.$store.dispatch("user/getScanStr");
        } catch (error) {
          console.log(error);
        }
      }
      this.$refs.qrCode.innerHTML = null;
      let qr = new QRCode(this.$refs.qrCode, {
        width: 300,
        height: 300,
        text: this.scanStr,
      });
      qr._el.title = "";
      this.qrOverTime = false;
      this.getScanData(this.scanStr);
    },
    // 轮询扫码登陆结果
    // code: 1.登陆成功，2.无登陆权限 , 3.二维码已失效 ， 0. API模块未授权
    getScanData(str) {
      this.$store
        .dispatch("user/scanlogin", str)
        .then((res) => {
          if (res.code == 0) {
            clearTimeout(this.time);
            this.time = setTimeout(() => {
              this.getScanData(str);
            }, 1000);
          } else if (res.code == 1) {
            Message({
              message: "扫码成功，欢迎登陆",
              type: "success",
              duration: 1000,
            });
            if (res.data.menu.children) {
              let arr = res.data.menu.children
              sessionStorage.setItem('leftNavList', JSON.stringify(arr))
              this.$router.push({ path: arr[0].url });
            }
          } else if (res.code == 2) {
            this.refreshQr();
            Message({
              message: "您没有登录权限",
              type: "info",
              duration: 3 * 1000,
              center: true,
            });
          } else if (res.code == 3) {
            this.qrOverTime = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    errShowHandler() {
      this.errorMeg = "";
    },
  },
  computed: {
    isLogin() {
      return this.userName != "" && this.pwd.length >= 6;
    },
  },
};
</script>

 <style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  min-width: 1200px;
  background: url(../../assets/images/loginbgi.jpg) no-repeat center;
  background-size: cover;
  overflow: hidden;
  .left-cont {
    position: absolute;
    left: 0.760417rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3.619792rem;
    color: #fff;
    font-family: 'PingFangSC-Medium';
    font-weight: 500;
    p {
      margin: 0;
    }
    p:nth-child(1) {
      font-size: 0.46875rem;
    }
    p:nth-child(2) {
      margin-top: 0.260417rem;
      font-size: 0.364583rem;
      color: #e3e3e3;
    }
  }
  .right-cont-scan,
  .right-cont-login {
    position: absolute;
    top: 50%;
    left: 5.354167rem;
    transform: translateY(-50%);
    width: 3.385417rem;
    height: 3.885417rem;
    border-radius: 0.078125rem;
    background: #fff;
    & > p:nth-child(1) {
      font-family: 'MicrosoftYaHei';
      font-size: 0.208333rem;
      color: #666;
      font-weight: 400;
      text-align: center;
    }
    .scan {
      position: relative;
      display: block;
      width: 1.859375rem;
      height: 1.859375rem;
      margin: 0.505208rem auto 0.078125rem;
      border-radius: 0.15625rem;
      box-shadow: 2px 2px 10px gray;
      overflow: hidden;
      .scan-can {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
      .overtimeTip {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        p {
          font-size: 0.182292rem;
          color: #fff;
        }
      }
    }
    .tips {
      margin: 0 auto;
      width: 1.28125rem;
      height: 0.223958rem;
      font-size: 0.104167rem;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
      color: #999999;
      p {
        margin: 0;
        text-align: center;
      }
    }
    .super-admin {
      position: absolute;
      right: 0.229167rem;
      bottom: 0.119792rem;
      height: 0.119792rem;
      font-size: 0.114583rem;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
      color: #b6b6b6;
      cursor: pointer;
      &::after {
        position: absolute;
        top: 0.015625rem;
        right: -0.098958rem;
        content: '';
        width: 0.088542rem;
        height: 0.104167rem;
        background: url(../../assets/images/arrow.png) no-repeat center;
        background-size: contain;
      }
    }
  }

  .right-cont-login {
    .username,
    .pwd {
      input {
        display: block;
        padding-left: 0.338542rem;
        width: 100%;
        height: 100%;
        font-size: 0.104167rem;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: #666;
        line-height: 0.322917rem;
        outline-style: none;
        border: 2px solid #d6d6d6;
        border-radius: 0.052083rem;
        &::placeholder {
          color: #e3e3e3;
        }
      }
    }
    .username,
    .pwd {
      position: relative;
      margin: 0.520833rem auto 0;
      width: 2.28125rem;
      height: 0.322917rem;
    }
    .username,
    .pwd {
      &::after {
        position: absolute;
        top: 0.0625rem;
        left: 0.083333rem;
        display: block;
        content: '';
        width: 0.182292rem;
        height: 0.182292rem;
        background: url(../../assets/images/loginuser.png) no-repeat center;
        background-size: cover;
      }
    }
    .pwd {
      margin-top: 0.15625rem;
      &::after {
        background: url(../../assets/images/loginpwd.png) no-repeat center;
        background-size: contain;
      }
    }
    .remember {
      margin: 0.130208rem auto 0;
      width: 2.28125rem;
      height: 0.104167rem;
      line-height: 0.104167rem;
      font-size: 0.104167rem;
      font-family: 'PingFang SC';
      font-weight: bold;
      color: #999999;
      label {
        margin-left: 0.0625rem;
      }
      input {
        width: 0.114583rem;
        height: 0.114583rem;
        border: 2px solid #999999;
        border-radius: 1px;
        vertical-align: middle;
      }
    }

    .loginbtn {
      display: block;
      margin: auto;
      width: 2.28125rem;
      height: 0.322917rem;
      border-radius: 0.052083rem;
      background: #999;
      border: 0;
      font-size: 0.15625rem;
      font-family: 'PingFang SC';
      font-weight: bold;
      color: #fff;
      cursor: pointer;
    }
    .err-tip {
      margin: 0.15625rem 0;
      height: 0.15625rem;
      line-height: 0.15625rem;
      font-size: 0.09375rem;
      color: red;
      text-align: center;
    }
  }
}
</style>

<style lang="scss" >
.login-container {
  .right-cont-scan {
    .scan {
      .scan-can {
        img {
          width: 80% !important;
          height: 80% !important;
        }
      }
    }
  }
}

.el-message__icon {
  font-size: x-large !important;
}
</style>
