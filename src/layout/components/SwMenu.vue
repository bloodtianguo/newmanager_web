<template>
  <div class="header">
    <div class="left-menu">
      <div class="header_logo">
        <img src="@/assets/images/logo.png" alt="" class="logo" />
        <img src="@/assets/images/logo_tit.png" alt="" class="logo_tit" />
      </div>
      <div class="tabbar">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          router
          background-color="#478DE4"
          text-color="#fff"
        >
          <el-menu-item
            :index="item.url"
            v-for="(item, index) in tablist"
            :key="index"
            :label="item.label"
          >
            <span class="label_wei">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="right-menu" @mouseover="mouseover()" @mouseleave="mouseleave()">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
        </div>
        <transition name="el-zoom-in-top">
          <div class="operation_box" v-show="operationShow">
            <!-- <div class="operalist">
              <div
                class="opera_card"
                v-for="(item, index) in operationlist"
                :key="index"
                @click="clickcard(item)"
              >
                <svg-icon :icon-class="item.icon"></svg-icon>
                <p class="tit fon12">{{ item.tit }}</p>
              </div>
            </div> -->
            <div class="loginout_Btn tc" @click="logout">退出登录</div>
          </div>
        </transition>
      </div>
      <span class="name-title">{{ name }}</span>
    </div>
  </div>
</template>

<script>
import deafultheader from '../../assets/images/header.png'
export default {
  created() {
    this.info();
    this.name = sessionStorage.name;
    let list = JSON.parse(sessionStorage.getItem('leftNavList'))
    if (list) {
      this.tablist = JSON.parse(sessionStorage.getItem('leftNavList'))
    } else {
      this.tablist = this.tablist
    }
  },
  data() {
    return {
      operationShow: false,
      name: "", //用户名
      avatar: deafultheader,
      activeIndex: this.$route.path,
      // 下拉操作列表
      operationlist: [
        {
          tit: "个人资料",
          routers: "/personalcenter/memberInfo",
          icon: "personal"
        },
        { tit: "修改密码", routers: "", icon: "chpassword" },
      ],
      tablist: [
        // 数据需要根据实际需求修改为真实数据
        { name: "统计管理", url: "/data" },
        { name: "主播管理", url: "/dashboard" },
        { name: '用户管理' },
        { name: '内容管理', url: '/content' },
        { name: '审核管理', url: '/audity' },
        { name: "财务管理", url: "/glance" },
        { name: "系统管理", url: "" },
        { name: "小工具", url: "/tool" },
      ]
    };
  },
  methods: {
    info() {
      let regUrl = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      if (regUrl.test(sessionStorage.avatar)) {
        this.avatar = sessionStorage.avatar;
      }
      this.activeIndex = this.$route.matched[0].redirect || this.$route.path // 默认选中
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
      sessionStorage.removeItem('leftNavList')
      localStorage.removeItem('currentIdx')
    },
    clickcard(row) {
      this.$router.push(row.routers);
    },
    mouseover() {
      this.operationShow = true;
    },
    mouseleave() {
      this.operationShow = false;
    }
  },
  computed: {

  },
  watch: {
    $route() {
      this.activeIndex = this.$route.matched[0].redirect || this.$route.path
    },
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: $swmenuBg;
  .left-menu {
    display: flex;
    justify-content: start;
    align-items: center;
    .tabbar {
      margin-bottom: -20px;
    }
  }
  .header_logo {
    width: 210px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      width: 50px;
      height: 50px;
    }
    .logo_tit {
      margin-left: 10px;
      height: 30px;
    }
  }
  .label_wei {
    font-weight: 600;
    font-size: 16px;
  }
  .el-menu-item {
    height: 40px;
    width: 130px;
    text-align: center;
    line-height: 45px;
    border-radius: 5px 5px 0 0;
    .label_wei {
      font-size: 16px !important;
    }
  }
  .el-menu-item.is-active {
    background-color: #fff !important;
    border-bottom: 2px solid transparent !important;
    span {
      color: $submenuActive_tit !important;
    }
  }
  .el-menu-item:hover {
    border-radius: 5px 5px 0 0 !important;
  }
}
/*右边资料头像部分*/
.right-menu {
  width: 240px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  border-left: 2px solid #3e83d8;
  padding-left: 10px;
  float: right;
  display: flex;
  position: relative;
  justify-content: start;
  align-content: flex-start;
  z-index: 11;
  .svg-container {
    cursor: pointer;
    font-size: 32px;
  }
  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;
    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .name-title {
    margin-left: -20px;
    color: #fff;
  }
  .avatar-container {
    padding-right: 30px;
    height: 40px !important;
    .avatar-wrapper {
      .user-avatar {
        margin-top: 10px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        border: 2px solid #fff;
      }
    }
  }
  .operation_box {
    //height: 160px;
    height: 40px;
    position: absolute;
    border: 2px solid #3e83d8;
    background-color: #fff;
    position: absolute;
    left: -2px;
    top: 60px;
    z-index: 10;
    width: 100%;
    .loginout_Btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: inline-block;
      font-size: 14px;
      height: 38px;
      line-height: 38px;
      color: #06c;
      background-color: #f0f0f0;
      border-top: 1px solid #e6e6e6;
      &:hover {
        color: #00c1de;
      }
    }
    .operalist {
      display: flex;
      display: -webkit-flex;
      justify-content: space-around;
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 10px;
      line-height: 18px;
      color: #788d9b;
      .opera_card {
        padding: 10px;
        height: 70px;
        display: inline-block;
        text-align: center;
        &:hover {
          color: #00c1de;
        }
        .svg-icon {
          width: 25px;
          height: 25px;
          margin: 0 auto;
          color: currentColor;
        }
        .tit {
          line-height: 18px;
          margin-top: 10px;
          color: currentColor;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
