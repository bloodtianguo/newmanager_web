<template>
  <div class="con_main">
    <el-row :gutter="20" class="mtb20">
      <el-col :span="20" :offset="0">
        <el-card shadow="hover" :body-style="{ paddingLeft: '0' }">
          <div slot="header">
            <div class="card_tit">
              <span class="svg-container tit_svgleft">
                <svg-icon icon-class="titleleft" />
              </span>
              公会会长账号信息
              <span class="svg-container">
                <svg-icon icon-class="title" />
              </span>
            </div>
          </div>
          <table class="vtable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="td1" rowspan="4">
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
              <td class="td4">{{ datas.nickName || '--' }}</td>
              <td class="td2">用户ID</td>
              <td class="td4">{{ datas.mzUserId || '--' }}</td>
              <td class="td2">绑定手机号</td>
              <td class="td4">{{ datas.phone || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">注册时间</td>
              <td class="td4">{{ datas.registerTimes || '--' }}</td>
              <td class="td2">地区</td>
              <td class="td4">{{ datas.region || '--' }}</td>
              <td class="td2">性别</td>
              <td class="td4">{{ datas.genders || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">粉丝</td>
              <td class="td4">{{ datas.fanNum || '--' }}</td>
              <td class="td2">作品数量</td>
              <td class="td4">{{ datas.workNums || '--' }}</td>
              <td class="td2"></td>
              <td class="td4"></td>
            </tr>
            <tr>
              <td class="td3">个人简介</td>
              <td colspan="5" class="td4">{{ datas.remark || '--' }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20" :offset="0">
        <el-card shadow="hover" :body-style="{ paddingLeft: '0' }">
          <div slot="header">
            <div class="card_tit">
              <span class="svg-container tit_svgleft">
                <svg-icon icon-class="titleleft" />
              </span>
              公会信息
              <span class="svg-container">
                <svg-icon icon-class="title" />
              </span>
            </div>
          </div>
          <table class="vtable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="td1" rowspan="5">
                <div class="td1_img_box">
                  <el-image
                    style="width: 150px; height: 150px"
                    :src="datas.picturePath"
                    fit="cover"
                  ></el-image>
                </div>
              </td>
              <td class="td2">公会名称</td>
              <td class="td4">
                {{ datas.guildName }}[
                <span class="modify" @click="changeName()">修改</span>
                ]
              </td>
              <td class="td2">旗下主播</td>
              <td class="td4">{{ datas.totalAnchor || '--' }}位</td>
              <td class="td2">旗下主播总点赞量</td>
              <td class="td4">{{ datas.likeTotalNum || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">入驻时间</td>
              <td class="td4">{{ datas.createTimes || '--' }}</td>
              <td class="td2">旗下主播作品量</td>
              <td class="td4">{{ datas.workTotalNum || '--' }}</td>
              <td class="td2">平台分成</td>
              <td v-if="datas.isDivideUpdate == 1" class="td4">
                {{ datas.updateWithdrawProportion || '--' }}%[
                <span class="modify" @click="changeShareUP()">修改中</span>]
              </td>
              <td v-else class="td4">
                {{ datas.platWithdrawProportion || '--' }}%[
                <span class="modify" @click="changeShare()">修改</span>]
              </td>
            </tr>
            <tr>
              <td class="td2">旗下主播关注量</td>
              <td class="td4">{{ datas.attentTotalNum || '--' }}</td>
              <td class="td2">被举报次数</td>
              <td class="td4">{{ datas.reportNums || '--' }}次</td>
              <td class="td2">总获取找票数（未提现）</td>
              <td class="td4">{{ datas.totalJBalance || '--' }}</td>
            </tr>
            <tr>
              <td class="td2">公长获得找票数</td>
              <td class="td4">{{ datas.guildJBalance || '--' }}</td>
              <td class="td2">主播获得找票数</td>
              <td class="td4">{{ datas.anchorJBalance || '--' }}</td>
              <td class="td2"></td>
              <td class="td4"></td>
            </tr>
            <tr>
              <td class="td3">公会简介</td>
              <td colspan="5" class="td4">{{ datas.guildRemark || '--' }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 弹窗盒子 -->
    <div class="dialog_box">
      <!-- 修改公会名称 -->
      <el-dialog
        title="修改公会名称"
        :visible.sync="Guildshow"
        width="40%"
        :before-close="nameClose"
        :close-on-click-modal="false"
      >
        <span>
          <el-form
            :model="Guildform"
            ref="Guildform"
            :rules="rules"
            label-width="100px"
            :inline="false"
            size="normal"
          >
            <el-form-item label="公会名称:" prop="guildName">
              <el-input v-model="Guildform.guildName" maxlength="10"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="nameClose">取 消</el-button>
          <el-button type="primary" @click="nameOk">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改平台分成-->
      <el-dialog
        title="修改平台分成"
        :visible.sync="propordio"
        width="40%"
        :close-on-click-modal="false"
        @close="proporclo"
      >
        <div>
          <el-form
            ref="Guildplatform"
            :model="Guildplatform"
            label-width="120px"
            :rules="rules"
          >
            <el-form-item
              label="平台分成"
              prop="platWithdrawProportion"
              :error="platerror"
            >
              <span class="slots--left">25%≤</span>
              <el-input
                v-model="Guildplatform.platWithdrawProportion"
                maxlength="2"
                style="width: 170px"
                min="25"
                max="50"
                @blur="changeplat"
                ><i slot="suffix" style="font-style: normal; margin-right: 10px"
                  >%</i
                ></el-input
              >
              <span class="slots--right">≤50%</span>
              <div>设置平台分成：公会和旗下主播找票，平台所得的平台分成</div>
            </el-form-item>
            <el-form-item label="修改原因" prop="reason">
              <el-input
                type="textarea"
                placeholder="请输入修改原因!"
                v-model="Guildplatform.reason"
                maxlength="20"
                resize="none"
                rows="3"
                show-word-limit
                clearable
              ></el-input>
              <template>更改平台分成后，次日00:00更新！</template>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer">
          <el-button @click="proporclo()">取消</el-button>
          <el-button type="primary" @click="proporok()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { guildDetail, updateGuild } from '@/api/guild/guildmanage'
export default {
  created() {
    if (this.$store.state.guild.guildId!=="") {
      sessionStorage.guildId = this.$store.state.guild.guildId
    }
    this.getfrom.guildId = sessionStorage.guildId
    this.getDetail()
  },
  data() {
    return {
      showimg:true,
      rules: {
        guildName: [
          { required: true, message: "请输入公会名称", trigger: "blur" },
          { min: 2, max: 10, message: "限制字符在2-10字符", trigger: "blur" }
        ],
        WithdrawProportion: [
          { required: true, message: "请选择设置平台分成", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入修改原因", trigger: "blur" },
          { min: 2, max: 20, message: "限制字符2-20个字", trigger: "blur" }
        ]
      },
      preData: { url: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" },
      Guildshow: false,
      platerror: null,//修改平台分成错误提示
      // 公会名称弹窗数据
      Guildform: {
        _uid: sessionStorage.userId,
        guildId: sessionStorage.guildId,
        guildName: ""
      },
      Guildplatform: {
        _uid: sessionStorage.userId,
        guildId: sessionStorage.guildId,
        platWithdrawProportion: "",
        updateWithdrawProportion: "",
        reason: "",
      },
      getfrom: {
        guildId: ""
      },
      propordio: false,//修改公会费率弹窗
      datas: {
        chairmanPath:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        picturePath:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      }
    }
  },
  methods: {
    srcerr(){
      this.showimg=false
    },
    srcload(){
      this.showimg=true
    },
    // 修改 接口?
    updatesetGuild(upldatefrom, changetype, valiform) {
      this.$refs[valiform].validate((valid) => {
        if (valid) {
          updateGuild(upldatefrom).then(response => {
            if (response.code == 0) {
              if (changetype == "name") {
                this.Success("成功修改公会名称!")
                this.Guildshow = false
              } else {
                this.Success("成功修改平台分成!")
                this.propordio = false
              }
              this.getDetail()
            }
          })
        } else {
          if (changetype == "name") {
            this.Guildshow = true
          } else {
            this.propordio = true
          }
          return false;
        }
      });
    },
    getDetail() {
      guildDetail(this.getfrom).then(response => {
        if (response.code == 0) {
          this.datas = response.data
          this.datas.createTimes = this.changedata(this.datas.createTime)
          this.datas.registerTimes = this.changedata(this.datas.registerTime)
          if (this.datas.gender == 0) {
            this.datas.genders = "男"
          } else if (this.datas.gender == 1) {
            this.datas.genders = "女"
          } else {
            this.datas.genders = "--"
          };
          this.datas.platWithdrawProportion = this.datas.platWithdrawProportion * 100;
          if (!this.datas.picturePath) {
            this.datas.picturePath = this.preData.url
          }
          if (!this.datas.chairmanPath) {
            this.datas.chairmanPath = this.preData.url
          }
        }
      })
    },
    //-------------修改公会名称部分--------------//
    changeName() {
      this.Guildform.guildName = JSON.parse(JSON.stringify(this.datas.guildName))
      this.Guildshow = true
    },
    nameClose() {
      this.Guildshow = false
    },
    nameOk() {
      // 确定修改公会名称 对接接口 成功隐藏
      this.updatesetGuild(this.Guildform, "name", "Guildform")
    },
    /*------------------------------------------*/
    changeShare() {
      this.propordio = true
      this.$nextTick(() => {
        this.$refs.Guildplatform.resetFields()
        this.Guildplatform.platWithdrawProportion = JSON.parse(JSON.stringify(this.datas.platWithdrawProportion))
      })
    },
    changeShareUP() {
      this.propordio = true
      this.$nextTick(() => {
        this.$refs.Guildplatform.resetFields()
        this.Guildplatform.platWithdrawProportion = JSON.parse(JSON.stringify(this.datas.updateWithdrawProportion))
      })
    },
    // 改变平台分成
    changeplat() {
      let value = this.Guildplatform.platWithdrawProportion
      if (value < 25 || value > 50) {
        this.platerror = "设置费率不符合条件!"
        return false
      } else {
        this.platerror = null
      }
    },
    proporclo() {
      this.propordio = false
    },
    proporok() {
      this.changeplat()
      if (this.platerror == null) {
        if (this.datas.isDivideUpdate == 1) {
          this.Guildplatform.updateWithdrawProportion = JSON.parse(JSON.stringify(this.Guildplatform.platWithdrawProportion))
          this.updatesetGuild(this.Guildplatform, "propor", "Guildplatform")
        } else {
          this.updatesetGuild(this.Guildplatform, "propor", "Guildplatform")
        }
      }
    }
  },
  //离开页面销毁
  destroyed() {
    this.$store.dispatch('guild/setGuildid', "")
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
.modify {
  color: #169bd5;
  font-size: 14px;
  cursor: pointer;
}
.slots--left {
  margin-right: 15px;
}
.slots--right {
  margin-left: 15px;
}
</style>
