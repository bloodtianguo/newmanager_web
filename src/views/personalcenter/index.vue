<template>
  <div class="app-container">
    <div class="export_main">
      <div class="export_title fonwei">个人资料</div>
    </div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card card-left" shadow="never">
          <div class="card-left-hearder">
            <div class="header-img">
              <el-image
                class="btncenter"
                style="width: 110px; height: 110px;border-radius:50%;"
                :src="userinfo.circleUrl"
                fit="cover"
              ></el-image>
            </div>
            <p class="tc fon24">{{ userinfo.nickname }}</p>
            <p class="tc fon14">
              {{ userinfo.identity }}{{ userinfo.ascription }}
            </p>
          </div>
          <div>
            <p>
              <svg-icon icon-class="email"></svg-icon
              ><span class="mgle10">{{ userinfo.email }}</span>
            </p>
            <p>
              <svg-icon icon-class="phone"></svg-icon
              ><span class="mgle10">{{ userinfo.phone }}</span>
            </p>
            <p>
              <svg-icon icon-class="address"></svg-icon
              ><span class="mgle10">{{ userinfo.address }}</span>
            </p>
          </div>
          <div class="line"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card card-right" shadow="never">
          <div slot="header" class="clearfix">
            <span class="fonwei fon18 colblu">基本信息</span>
          </div>
          <div>
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="formLabelAlign"
            >
              <el-form-item label="账号">
                <el-input v-model="frominfo.acc" style="width:220px"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="frominfo.sex">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="frominfo.email" style="width:220px"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="frominfo.username" style="width:220px"></el-input>
              </el-form-item>
              <el-form-item label="出生日期">
                <el-date-picker
                  v-model="frominfo.birthday"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="frominfo.phone" style="width:220px"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadIMG from "@/components/uploadIMG";
export default {
  components: {
    UploadIMG
  },
  data() {
    return {
      userinfo: {
        circleUrl:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif", //头像
        nickname: "没找",
        identity: "超级管理员", //身份
        ascription: "总公司", //身份归属
        email: "sn93@qq.com", //邮箱
        phone: "18200000000", //手机号
        address: "中国 北京市 朝阳区 xxx街道 000号" //地址
      },
      frominfo: {
        acc: "admin", //账号
        sex: 1, //性别
        email: "sn93@qq.com", //邮箱
        username: "没找",
        birthday: "2018-11-16",
        phone: "18200000000" //联系电话
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 670px;
  .export_main {
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e1e6eb;
    margin-bottom: 10px;
    .export_title {
      font-size: 18px;
      line-height: 30px;
      padding: 0 0 10px 8px;
      position: relative;
      &::before {
        content: "";
        width: 2px;
        height: 30px;
        position: absolute;
        left: 0;
        background-color: #70b3c3;
      }
    }
  }
  .box-card {
    height: 580px;
  }
  .card-left {
    padding: 0 30px;
    .card-left-hearder {
      .header-img {
        width: 110px;
        height: 110px;
        margin-bottom: 15px;
        margin: 0 auto;
        border-radius: 55px;
        overflow: hidden;
        img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 55px;
          margin: 0 auto;
        }
      }
    }
  }
  .card-right {
  }
}
</style>
