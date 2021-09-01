<template>
  <div class="con_main">
    <el-row :gutter="20">
      <el-col :span="20" :offset="0">
        <el-card shadow="hover" :body-style="{ paddingLeft: '0' }">
          <div slot="header">
            <div class="card_tit">
              <span class="svg-container tit_svgleft">
                <svg-icon icon-class="titleleft"
              /></span>
              主播账号信息
              <span class="svg-container"><svg-icon icon-class="title" /></span>
            </div>
          </div>
          <table class="vtable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="td1" rowspan="5">
                <div class="td1_img_box">
                  <el-image
                    style="width: 150px; height: 150px"
                    :src="dataList.portraitPath"
                    fit="cover"
                    @error="porimgErr()"
                  ></el-image>
                </div>
              </td>
              <td class="td2">主播昵称</td>
              <td class="td4">{{ dataList.nickName || '--' }}</td>
              <td class="td2">用户ID</td>
              <td class="td4">{{ dataList.mzUserId || '--' }}</td>
              <td class="td2">绑定手机号</td>
              <td class="td4">{{ dataList.phone || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">公会名称</td>
              <td class="td4">{{ dataList.guildName || '--' }}</td>
              <td class="td2">类型</td>
              <td class="td4">{{ dataList.types || '--' }}</td>
              <td class="td2">分佣比例</td>
              <td class="td4">{{ dataList.commissionRatio || '--' }}%</td>
            </tr>
            <tr>
              <td class="td2">入会时间</td>
              <td class="td4">{{ dataList.createTime || '--' }}</td>
              <td class="td2">作品数量</td>
              <td class="td4">{{ dataList.workNums || '--' }}</td>
              <td class="td2">主播获取找票数</td>
              <td class="td4">{{ dataList.anchorJBalance || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">主播粉丝量</td>
              <td class="td4">{{ dataList.fansNums || '--' }}</td>
              <td class="td2">总获取找票数量（未分账）</td>
              <td class="td4">{{ dataList.totalJBalance || '--' }}</td>
              <td class="td2">被举报次数</td>
              <td class="td4">{{ dataList.reportNums || '--' }}</td>
            </tr>
            <tr>
              <td class="td3">主播简介</td>
              <td colspan="5" class="td4">{{ dataList.remarks || '--' }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { anchorDetail } from '@/api/guild/guildmanage'
export default {
  created() {
    if (this.$store.state.guild.guildId!=="") {
      sessionStorage.guildId = this.$store.state.guild.guildId
    }
    this.getfrom.guildId = sessionStorage.guildId
    if (this.$store.state.guild.anchorId!=="") {
      sessionStorage.anchorId = this.$store.state.guild.anchorId
    }
    this.getfrom.anchorId = sessionStorage.anchorId
    this.fetchData()
  },
  destroyed() {
     this.$store.dispatch('guild/setGuildid', "")
     this.$store.dispatch('guild/setAnchorId', "")
  },
  data() {
    return {
      getfrom: {
        guildId: "",
        anchorId: "",
      },//用于获取主播详细信息
      preData: { url: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" },//接口无参数
      // type	integer($int32) 类型
      dataList: {
        nickName: "",//主播名字 nickName
        mzUserId: "",//用户ID mzUserId
        phone: "",//手机号 phone
        guildName: "",//公会名称
        types: "",//类型 type ????
        commissionRatio: "",//分佣比例 commissionRatio
        createTime: "",//入会时间 createTime
        workNums: 0,//作品数量 workNums
        anchorJBalance: "",//主播获取找票数 anchorJBalance
        fansNums: "",//主播粉丝数量
        totalJBalance: "",//总获取找票数量（未分账） totalJBalance
        reportNums: "",//被举报次数 reportNums
        remarks: "",
        portraitPath: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"//主播头像
      }
    }
  },
  methods: {
   porimgErr(){
     this.dataList.portraitPath="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
     this.forceUpdate()
   },
    // 获取主播详情
    fetchData() {
      anchorDetail(this.getfrom).then(response => {
        if (response.code == 0) {
          this.dataList = this.switchtypeVal(response.data)
          this.dataList.createTime = this.changedata(this.dataList.createTime)
          if (!this.dataList.portraitPath) {
            this.dataList.this.portraitPath = preData.url
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.con_main {
  height: 100%;
  background: url(../../assets/images/deilback.png) no-repeat center;
}
.mtb20 {
  margin-bottom: 30px;
}
.tab_box {
  display: flex;
  table {
    height: 90px;
    margin-left: 10px;
  }
  td {
    width: 150px;
    line-height: 30px;
    tr {
      width: 150px;
      text-align: center;
      border-bottom: 1px solid #ebeef5;
    }
  }
}
.tabbg {
  background-color: #ebeef5;
}

.td1 {
  width: 150px !important;
  border: none !important;
}

.card_tit {
  text-align: center;
  font: bold;
  font-size: 18px;
}
.image__inner {
  border-radius: 5px !important;
}
.tit_svgleft {
  .svg-icon {
    transform: rotateY(-180deg);
  }
}
</style>
