<template>
  <div class="app-container">
   <el-divider>基本信息</el-divider>
   <el-card shadow="hover">
          <table class="vtable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="td1" rowspan="7">
                <div class="td1_img_box">
                   <el-image
                   v-if="showimg"
                    style="width: 150px; height: 150px"
                    :src="datas.chairmanPath"
                    fit="cover"
                    @error="srcerr()"
                    @load="srcload()"
                  ></el-image>
                   <el-image
                   v-else
                    style="width: 150px; height: 150px"
                    :src="preData.url"
                    fit="cover"
                  ></el-image>
                </div>
              </td>
              <td class="td2">用户昵称</td>
              <td class="td4"></td>
              <td class="td2">用户ID</td>
              <td class="td4"></td>
              <td class="td2">用户等级</td>
              <td class="td4"></td>
              <td class="td2">绑定手机号</td>
              <td class="td4"></td>
            </tr>
            <tr>
              <td class="td2">注册时间</td>
              <td class="td4"></td>
              <td class="td2">地区</td>
              <td class="td4"></td>
              <td class="td2">性别</td>
              <td class="td4"></td>
              <td class="td2">年龄</td>
              <td class="td4"></td>
            </tr>
             <tr>
              <td class="td2">邀请码</td>
              <td class="td4"></td>
              <td class="td2">上级用户ID</td>
              <td class="td4"></td>
              <td class="td2">上级邀请码</td>
              <td class="td4"></td>
              <td class="td2">账户类型</td>
              <td class="td4"></td>
            </tr>
            <tr>
              <td class="td2">用户类型</td>
              <td class="td4"></td>
              <td class="td2">店铺类型</td>
              <td class="td4"></td>
              <td class="td2">店铺id</td>
              <td class="td4"></td>
               <td class="td2">店铺名称</td>
              <td class="td4"></td>
            </tr>
             <tr>
              <td class="td2">商家id</td>
              <td class="td4"></td>
              <td class="td2">商家名称</td>
              <td class="td4"></td>
              <td class="td2">商家会员等级</td>
              <td class="td4"></td>
               <td class="td2">提现费率</td>
              <td class="td4"></td>
            </tr>
             <tr>
              <td class="td2">粉丝</td>
              <td class="td4"></td>
              <td class="td2">关注用户</td>
              <td class="td4"></td>
              <td class="td2"></td>
              <td class="td4"></td>
               <td class="td2">被举报次数</td>
              <td class="td4"></td>
            </tr>
            <tr>
              <td class="td3">个人简介</td>
              <td colspan="7" class="td4"></td>
            </tr>
          </table>
   </el-card>
   <el-divider>账户信息</el-divider>
    <el-card shadow="hover">

   </el-card>
  </div>

</template>

<script>
  export default {
    created () {

    },
data () {
  return {
    searchinfo:{
      userId:101279,
    },
    datas:{},
    showimg:"",//头像是否显示
    preData:{
      url: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
    }
  }
},
methods: {
  getdatas(){

  }
}
  }
</script>

<style lang="scss" scoped>
.td1_img_box{
  margin: 0;
}
.vtable td{
  line-height: 40px;
}
</style>
