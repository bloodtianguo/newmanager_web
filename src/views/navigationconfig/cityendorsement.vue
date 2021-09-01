<template>
  <div class="app-container">
    <!-- 新增城市代言 -->
    <div class="TitTopfon Tittop">导航配置-城市代言</div>
    <el-button type="success"
               size="small"
               @click="clicksave('addform')"
               v-if="saveBtnShow"
               class="marginb">保存</el-button>
    <el-form :model="addform"
             ref="addform"
             :rules="rules"
             label-width="120px"
             :inline="false"
             size="normal">
      <!-- 第一广告区 -->
      <el-card shadow="hover"
               style="margin:0 0 20px 0"
               :body-style="{ padding: '20px',background:'#FBFCFE'}">
        <div slot="header"
             class="Titles Titles_one">第一广告区</div>
        <div>
          <div class="conOne">
            <el-divider content-position="center"
                        class="divider_box">广告1设置</el-divider>
            <div v-if="firstTopval"
                 key="firstTophasprop">
              <el-form-item label="活动名称"
                            :prop="'arrayFirst[0].name'"
                            :rules="{ required: true, message: '请输入活动名称', trigger: 'blur' }">
                <el-input placeholder="请输入活动名称(最多6个字)"
                          maxlength="6"
                          clearable
                          :disabled="!saveBtnShow"
                          @input="inputFirsttop()"
                          v-model="addform.arrayFirst[0].name"></el-input>
              </el-form-item>
              <el-form-item label="活动副标题"
                            :prop="'arrayFirst[0].subtitle'"
                            :rules="{ required: true, message: '请输入活动副标题', trigger: 'blur' }">
                <el-input placeholder="请输入活动副标题(最多7个字)"
                          maxlength="7"
                          clearable
                          @input="inputFirsttop()"
                          :disabled="!saveBtnShow"
                          v-model="addform.arrayFirst[0].subtitle"></el-input>
              </el-form-item>
              <el-form-item label="跳转链接"
                            :prop="'arrayFirst[0].jumpUrl'"
                            :rules="{ required: true, message: '请输入跳转链接', trigger: 'blur' }">
                <el-input placeholder="请输入活动跳转链接"
                          clearable
                          @input="inputFirsttop()"
                          :disabled="!saveBtnShow"
                          v-model="addform.arrayFirst[0].jumpUrl"></el-input>
              </el-form-item>
            </div>
            <div v-else
                 key="firstTopnoprop">
              <el-form-item label="*活动名称">
                <el-input placeholder="请输入活动名称(最多6个字)"
                          maxlength="6"
                          clearable
                          :disabled="!saveBtnShow"
                          @input="inputFirsttop()"
                          v-model="addform.arrayFirst[0].name"></el-input>
              </el-form-item>
              <el-form-item label="*活动副标题">
                <el-input placeholder="请输入活动副标题(最多7个字)"
                          maxlength="7"
                          clearable
                          :disabled="!saveBtnShow"
                          @input="inputFirsttop()"
                          v-model="addform.arrayFirst[0].subtitle"></el-input>
              </el-form-item>
              <el-form-item label="*跳转链接">
                <el-input placeholder="请输入活动跳转链接"
                          clearable
                          :disabled="!saveBtnShow"
                          @input="inputFirsttop()"
                          v-model="addform.arrayFirst[0].jumpUrl"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-row :gutter="24"
                  v-for="(exitem,index) in posterFirstEx"
                  :key="index">
            <!-- 循环 -->
            <el-divider direction="horizontal"
                        content-position="center"
                        class="careful_text">
              配置时必须同时配置相邻两个广告（服务）
            </el-divider>
            <el-divider content-position="center"
                        class="divider_box">
              <span class="divider_icon marginle10"
                    @click="firstAddfrom()"
                    v-if="saveBtnShow">
                <i class="el-icon-document-add icon_one"></i>
              </span>
            </el-divider>
            <el-col :span="11"
                    :offset="0"
                    v-for="(aditem,index) in addform.arrayFirst[1]"
                    :key="index"
                    style="height:350px">
              <el-divider content-position="center"
                          class="divider_box">
                <span class="divider_tit">广告{{index+2}}设置</span>
                <template v-if="index%2!==0">
                  <span class="divider_icon"
                        @click="firstDelfrom(index)"
                        v-if="saveBtnShow">
                    <i class="el-icon-delete-solid icon_two"></i>
                  </span>
                </template>
              </el-divider>
              <div v-if="firstval"
                   key="firstHasProp">
                <el-form-item label="服务名称"
                              :prop="'arrayFirst[1].' + index + '.name'"
                              :rules="{ required: true, message: '请输入服务名称', trigger: 'blur' }">
                  <el-input placeholder="请输入服务名称(最多6个字)"
                            maxlength="6"
                            clearable
                            :disabled="!saveBtnShow"
                            v-model="addform.arrayFirst[1][index].name"
                            @input="inputFirst(index)"></el-input>
                </el-form-item>
                <el-form-item label="服务副标题"
                              :prop="'arrayFirst[1].' + index + '.subtitle'"
                              :rules="{ required: true, message: '请输入服务副标题', trigger: 'blur' }">
                  <el-input placeholder="请输入服务副标题(最多7个字)"
                            maxlength="7"
                            clearable
                            :disabled="!saveBtnShow"
                            @input="inputFirst(index)"
                            v-model="addform.arrayFirst[1][index].subtitle"></el-input>
                </el-form-item>
                <el-form-item label="主题图"
                              :prop="'arrayFirst[1].' + index + '.titlePicUrl'"
                              :rules="{ required: true, message: '请上传主题图', trigger: 'blur' }">
                  <div class="upload_box">
                    <div class="img_box">
                      <el-image :src="addform.arrayFirst[1][index].titlePicUrl"
                                v-if="addform.arrayFirst[1][index].titlePicUrl"
                                fit="cover"
                                :lazy="true"></el-image>
                    </div>
                    <el-upload accept="image/jpeg,image/png"
                               class="avatar-uploader"
                               :action="ITEMS_UP_IMG"
                               :show-file-list="false"
                               :headers="myHeaders"
                               :on-success="dynamicPicSuccess.bind(null, {'index':index,'data':aditem})"
                               :before-upload="beforeUploadImg"
                               v-if="saveBtnShow">
                      <el-button style="margin-left: 10px;"
                                 size="small"
                                 type="success">上传</el-button>
                      <span slot="tip"
                            class="el-upload__tip marginle10">只支持jpg/png/gif格式文件，文件不超过2M</span>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="跳转链接"
                              :prop="'arrayFirst[1].' + index + '.jumpUrl'"
                              :rules="{ required: true, message: '请输入活动跳转链接', trigger: 'blur' }">
                  <el-input placeholder="请输入活动跳转链接"
                            clearable
                            :disabled="!saveBtnShow"
                            @input="inputFirst(index)"
                            v-model="addform.arrayFirst[1][index].jumpUrl"></el-input>
                </el-form-item>
              </div>
              <div v-else
                   key="firstNoProp">
                <el-form-item label="*服务名称">
                  <el-input placeholder="请输入服务名称(最多6个字)"
                            maxlength="6"
                            clearable
                            @input="inputFirst(index)"
                            :disabled="!saveBtnShow"
                            v-model="addform.arrayFirst[1][index].name"></el-input>
                </el-form-item>
                <el-form-item label="*服务副标题">
                  <el-input placeholder="请输入服务副标题(最多7个字)"
                            maxlength="7"
                            clearable
                            :disabled="!saveBtnShow"
                            @input="inputFirst(index)"
                            v-model="addform.arrayFirst[1][index].subtitle"></el-input>
                </el-form-item>
                <el-form-item label="*主题图">
                  <div class="upload_box">
                    <div class="img_box">
                      <el-image :src="addform.arrayFirst[1][index].titlePicUrl"
                                v-if="addform.arrayFirst[1][index].titlePicUrl"
                                fit="cover"
                                :lazy="true"></el-image>
                    </div>
                    <el-upload accept="image/jpeg,image/png"
                               class="avatar-uploader"
                               :action="ITEMS_UP_IMG"
                               :show-file-list="false"
                               :headers="myHeaders"
                               :on-success="dynamicPicSuccess.bind(null, {'index':index,'data':aditem})"
                               :before-upload="beforeUploadImg"
                               v-if="saveBtnShow">
                      <el-button style="margin-left: 10px;"
                                 size="small"
                                 type="success">上传</el-button>
                      <span slot="tip"
                            class="el-upload__tip marginle10">只支持jpg/png/gif格式文件，文件不超过2M</span>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="*跳转链接">
                  <el-input placeholder="请输入活动跳转链接"
                            clearable
                            :disabled="!saveBtnShow"
                            @input="inputFirst(index)"
                            v-model="addform.arrayFirst[1][index].jumpUrl"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 楼层广告区 -->
      <el-card shadow="hover"
               style="margin:0 0 20px 0"
               :body-style="{ padding: '20px',background:'#FBFCFE'}">
        <div slot="header"
             class="Titles Titles_two">楼层广告区
          <div class="tit_Tips">设置规则：不限个数，按照配置前后排序</div>
        </div>
        <el-divider content-position="center"
                    class="divider_box">
          <span class="divider_icon marginle10"
                @click="secondAddfrom()"
                v-if="saveBtnShow">
            <i class="el-icon-document-add icon_one"></i>
          </span>
        </el-divider>
        <el-row :gutter="24">
          <el-col :span="11"
                  :offset="0"
                  v-for="(aditem,index) in addform.arraySecond"
                  :key="index">
            <el-divider content-position="center"
                        class="divider_box">
              <span class="divider_tit">活动{{index+1}}设置</span>
              <span class="divider_icon"
                    @click="secondDelfrom(index)"
                    v-if="saveBtnShow">
                <i class="el-icon-delete-solid icon_two"></i>
              </span>
            </el-divider>
            <!-- 根据是否输入值决定是否验证 -->
            <div v-if="secondHasval"
                 key="secondHasProp">
              <el-form-item label="主题图"
                            :prop="'arraySecond.' + index + '.titlePicUrl'"
                            :rules="{ required: true, message: '请上传主题图', trigger: 'blur' }">
                <div class="upload_box">
                  <div class="img_box">
                    <el-image :src="addform.arraySecond[index].titlePicUrl"
                              v-if="addform.arraySecond[index].titlePicUrl"
                              fit="cover"
                              :lazy="true"></el-image>
                  </div>
                  <el-upload accept="image/jpeg,image/png"
                             class="avatar-uploader"
                             :action="ITEMS_UP_IMG"
                             :show-file-list="false"
                             :headers="myHeaders"
                             :on-success="dynamicPicSuccess2.bind(null, {'index':index,'data':aditem})"
                             :before-upload="beforeUploadImg2"
                             v-if="saveBtnShow">
                    <el-button style="margin-left: 10px;"
                               size="small"
                               type="success">上传</el-button>
                    <span slot="tip"
                          class="el-upload__tip marginle10">只支持jpg/png格式文件，文件不超过2M</span>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="跳转链接"
                            :prop="'arraySecond.' + index + '.jumpUrl'"
                            :rules="{ required: true, message: '请输入跳转链接', trigger: 'blur' }">
                <el-input placeholder="请输入跳转链接"
                          :disabled="!saveBtnShow"
                          clearable
                          autofocus
                          @input="inputJumpUrl(addform.arraySecond[index].jumpUrl,addform.arraySecond[index].titlePicUrl)"
                          @clear="inputJumpUrl(addform.arraySecond[index].jumpUrl,addform.arraySecond[index].titlePicUrl)"
                          v-model="addform.arraySecond[index].jumpUrl"></el-input>
              </el-form-item>
            </div>
            <div v-else
                 key="secondNoProp">
              <el-form-item label="*主题图"
                            :prop="'arraySecond.' + index + '.titlePicUrl'"
                            :rules="{ required: false, message: '请上传主题图', trigger: 'blur' }">
                <div class="upload_box">
                  <div class="img_box">
                    <el-image :src="addform.arraySecond[index].titlePicUrl"
                              v-if="addform.arraySecond[index].titlePicUrl"
                              fit="cover"
                              :lazy="true"></el-image>
                  </div>
                  <el-upload accept="image/jpeg,image/png"
                             class="avatar-uploader"
                             :action="ITEMS_UP_IMG"
                             :show-file-list="false"
                             :headers="myHeaders"
                             :on-success="dynamicPicSuccess2.bind(null, {'index':index,'data':aditem})"
                             :before-upload="beforeUploadImg2"
                             v-if="saveBtnShow">
                    <el-button style="margin-left: 10px;"
                               size="small"
                               type="success">上传</el-button>
                    <span slot="tip"
                          class="el-upload__tip marginle10">只支持jpg/png格式文件，文件不超过2M</span>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="*跳转链接"
                            :prop="'arraySecond.' + index + '.jumpUrl'"
                            :rules="{ required: false, message: '请输入跳转链接', trigger: 'blur' }">
                <el-input placeholder="请输入跳转链接"
                          :disabled="!saveBtnShow"
                          clearable
                          @input="inputJumpUrl(addform.arraySecond[index].jumpUrl,addform.arraySecond[index].titlePicUrl)"
                          @clear="inputJumpUrl(addform.arraySecond[index].jumpUrl,addform.arraySecond[index].titlePicUrl)"
                          v-model="addform.arraySecond[index].jumpUrl"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

      </el-card>
      <!-- 快捷入口区 -->
      <el-card shadow="hover"
               style="margin:0 0 20px 0"
               :body-style="{ padding: '20px',background:'#FBFCFE'}">
        <div slot="header"
             class="Titles Titles_three">快捷入口区
          <div class="tit_Tips">设置规则：不限个数，按照配置前后排序</div>
        </div>
        <div>
          <div class="conOne">
            <el-divider content-position="center"
                        class="divider_box">*快捷区域设置</el-divider>
            <el-form-item label="区域名称"
                          :prop="'arrayLast[0].name'"
                          :rules="{ required: true, message: '请输入区域名称', trigger: 'blur' }">
              <el-input placeholder="请输入区域名称(最多6个字)"
                        maxlength="6"
                        clearable
                        :disabled="!saveBtnShow"
                        v-model="addform.arrayLast[0].name"></el-input>
            </el-form-item>
            <el-form-item label="副标题">
              <el-input placeholder="请输入活动副标题(最多20个字)"
                        maxlength="20"
                        clearable
                        :disabled="!saveBtnShow"
                        v-model="addform.arrayLast[0].subtitle"></el-input>
            </el-form-item>
          </div>
          <el-row :gutter="24">
            <el-col :span="11"
                    :offset="0"
                    v-for="(aditem,index) in addform.arrayLast[1]"
                    :key="index">
              <el-divider content-position="center"
                          class="divider_box">
                <span class="divider_tit">入口{{index+1}}设置</span>
                <span class="divider_icon marginle10"
                      @click="lastAddfrom()"
                      v-if="saveBtnShow">
                  <i class="el-icon-document-add icon_one"></i>
                </span>
                <span class="divider_icon"
                      @click="lastDelfrom(index)"
                      v-if="saveBtnShow">
                  <i class="el-icon-delete-solid icon_two"></i>
                </span>
              </el-divider>
              <el-form-item label="服务名称"
                            :prop="'arrayLast[1].' + index + '.name'"
                            :rules="{ required: true, message: '服务名称不能为空', trigger: 'blur' }">
                <el-input placeholder="请输入服务名称(最多6个字)"
                          maxlength="6"
                          clearable
                          :disabled="!saveBtnShow"
                          v-model="addform.arrayLast[1][index].name"></el-input>
              </el-form-item>
              <el-form-item label="主题图"
                            :prop="'arrayLast[1].' + index + '.titlePicUrl'"
                            :rules="{ required: true, message: '请上传图片', trigger: 'blur' }">
                <div class="upload_box">
                  <div class="img_box">
                    <el-image :src="addform.arrayLast[1][index].titlePicUrl"
                              v-if="addform.arrayLast[1][index].titlePicUrl"
                              fit="cover"
                              :lazy="true"></el-image>
                  </div>
                  <el-upload accept="image/jpeg,image/png"
                             class="avatar-uploader"
                             :action="ITEMS_UP_IMG"
                             :show-file-list="false"
                             :headers="myHeaders"
                             :on-success="dynamicPicSuccess3.bind(null, {'index':index,'data':aditem})"
                             :before-upload="beforeUploadImg3"
                             v-if="saveBtnShow">
                    <el-button style="margin-left: 10px;"
                               size="small"
                               type="success">上传</el-button>
                    <span slot="tip"
                          class="el-upload__tip marginle10">只支持jpg/png格式文件，文件不超过10KB</span>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="跳转链接"
                            :prop="'arrayLast[1].' + index + '.jumpUrl'"
                            :rules="{ required: true, message: '跳转链接不能为空', trigger: 'blur' }">
                <el-input placeholder="请输入跳转链接"
                          :disabled="!saveBtnShow"
                          clearable
                          v-model="addform.arrayLast[1][index].jumpUrl"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-card>
    </el-form>
  </div>
</template>

<script>
import { ITEMS_UP_IMG } from '@/utils/request'
import { getToken } from '@/utils/auth'
import { BarDetail, addHomeBars, updateHomeBar } from '@/api/navigationconfig'
import { Success, Infos } from '@/utils/tools/message.js'
// import Upload from "@/components/upload";//新增城市代言
export default {
  // components: {
  //   Upload,
  // },
  created () {
    this.cityInfostate = this.$store.state.user.cityInfostate
    this.getDetail()
    this.initshow()
  },
  data () {
    return {
      myHeaders: { token: getToken() },
      ITEMS_UP_IMG: ITEMS_UP_IMG,
      cityInfostate: "",//从何处打开弹窗
      firstTopval: false,//第一广告验证
      firstval: false,//是否打开第一部分验证
      secondHasval: false,//是否打开第二部分验证
      // 保存按钮是否显示
      saveBtnShow: true,
      deTail: {
        homeId: "",
      },
      homeBar: {
        secAd: [], type: 0, homeId: ""
      },
      addformIn: {
        arrayFirst: [
          {}, []
        ],
        arraySecond: [],
        arrayLast: [
          {}, []
        ],
      },
      addform: {
        arrayFirst: [
          {
            createTime: "",
            homeId: 0,
            id: 0,
            jumpUrl: "",
            name: "",
            setType: 1,
            subtitle: "",
            titlePicUrl: "",
            updateTime: ""
          },
          // 广告2以及循环设置
          [
            // 点击添加需要在此动态添加参数
            {
              createTime: "",
              homeId: 0,
              id: 0,
              jumpUrl: "",
              name: "",
              setType: 2,
              subtitle: "",
              titlePicUrl: "",
              updateTime: ""
            },
            {
              createTime: "",
              homeId: 0,
              id: 0,
              jumpUrl: "",
              name: "",
              setType: 2,
              subtitle: "",
              titlePicUrl: "",
              updateTime: ""
            },
          ],
        ],
        arraySecond: [
          {
            createTime: "",
            homeId: 0,
            id: 0,
            jumpUrl: "",
            name: "",
            setType: 3,
            subtitle: "",
            titlePicUrl: "",
            updateTime: ""
          },
        ],
        arrayLast: [
          {
            createTime: "",
            homeId: 0,
            id: 0,
            jumpUrl: "",
            name: "",
            setType: 4,
            subtitle: "",
            titlePicUrl: "",
            updateTime: ""
          },
          [
            {
              createTime: "",
              homeId: 0,
              id: 0,
              jumpUrl: "",
              name: "",
              setType: 5,
              subtitle: "",
              titlePicUrl: "",
              updateTime: ""
            },
          ]
        ]
      },
      // 第一广告区内外部部循环
      posterFirstEx: [[{}, {},],],
      rules: {
        swapname: [
          { required: true, message: '请输入活动标题', trigger: 'blur' },
          //     { validator: checkUserID, trigger: 'blur' }
        ]
      },
    }
  },
  // 监听vuex中Cityinfostate变化
  computed: {
    getStoreItem () {
      return this.$store.state.user.cityInfostate
    }
  },
  watch: {
    getStoreItem () {
      this.cityInfostate = this.$store.state.user.cityInfostate;
    }
  },
  methods: {
    resetData () {
      this.$nextTick(() => {
        this.$refs.addform.resetFields()//重置表单
      })
    },
    initshow () {
      if (sessionStorage.homeId) {
        this.homeBar.homeId = sessionStorage.homeId
      }
      if (this.cityInfostate == "详情") {
        this.saveBtnShow = false;
      } else {
        this.saveBtnShow = true;
        this.resetData()
      }
    },
    clicksave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 添加第一部分数据
          if (this.addform.arrayFirst[0]) {
            if (this.addform.arrayFirst[0].name) {
              this.addform.arrayFirst[0].setType = 1
              this.homeBar.secAd.push(this.addform.arrayFirst[0])
            }
          }
          if (this.addform.arrayFirst[1][0]) {
            if (this.addform.arrayFirst[1][0].name) {
              this.addform.arrayFirst[1].map(item => {
                this.homeBar.secAd.push(item)
              })
            }
          }
          // 添加第二部分数据
          if (this.addform.arraySecond.length > 0) {
            this.addform.arraySecond.map(item => {
              this.homeBar.secAd.push(item)
            })
          }
          // 添加第三部分数据
          if (this.addform.arrayLast[0].name) {
            this.homeBar.secAd.push(this.addform.arrayLast[0])
          }
          if (this.addform.arrayLast[1][0].name) {
            this.addform.arrayLast[1].map(item => {
              this.homeBar.secAd.push(item)
            })
          }
          switch (this.cityInfostate) {
            case "增加":
              this.addhome()
              break;
            case "编辑":
              this.edithome()
              break;
            default:
              break;
          }
          // 发送添加接口
        } else {
          this.$alert('内容不复合要求请重新配置!', {
            confirmButtonText: '确定',
          });
          return false;
        }

      });

    },
    resetform () {
      this.$nextTick(() => {
        this.$refs.addform.resetFields()//重置表单
      })
    },
    // 发送添加接口
    addhome () {
      addHomeBars(this.homeBar).then(response => {
        if (response.code == "0") {
          Success("添加成功!")
          // this.resetform()//重置表单
          this.$parent.CityshowClo();
          this.$store.dispatch('user/setCityPopupval', false)
        } else {
          this.$message.error(`${response.data.msg}`);
        }
      })
    },
    //发送更新接口
    edithome () {
      updateHomeBar(this.homeBar).then(response => {
        console.log(this.homeBar);
        if (response.code == "0") {
          Success("更新信息成功!")
          // this.resetform()//重置表单
          this.$parent.CityshowClo();
          this.$store.dispatch('user/setCityPopupval', false)
        } else {
          this.$message.error(`${response.data.msg}`);
        }
      })
    },
    // 从列表详情获取详情
    getDetail () {
      if (this.cityInfostate == "详情" || this.cityInfostate == "编辑") {
        if (sessionStorage.homeId) {
          this.deTail.homeId = sessionStorage.homeId
          if (this.deTail.homeId) {
            BarDetail(this.deTail).then(response => {
              if (response.code == "0") {
                response.data.map(item => {
                  switch (item.setType) {
                    case 1:
                      this.addformIn.arrayFirst[0] = item
                      break;
                    case 2:
                      this.addformIn.arrayFirst[1].push(item);
                      break;
                    case 3:
                      this.addformIn.arraySecond.push(item);
                      break;
                    case 4:
                      this.addformIn.arrayLast[0] = item;
                      break;
                    case 5:
                      this.addformIn.arrayLast[1].push(item);
                      break;
                    default:
                      break;
                  }
                  this.addform = JSON.parse(JSON.stringify(this.addformIn))
                  if (!this.addform.arrayFirst[0].name || !this.addform.arrayFirst[0].subtitle || !this.addform.arrayFirst[0].jumpUrl) {
                    this.firstTopval = false
                  } else {
                    this.firstTopval = true
                  }
                  if (this.addform.arrayFirst[1].length > 0) {
                    if (!this.addform.arrayFirst[1][0].name || !this.addform.arrayFirst[1][0].subtitle || !this.addform.arrayFirst[1][0].titlePicUrl || !this.addform.arrayFirst[1][0].jumpUrl) {
                      this.firstval = true
                    } else {
                      this.firstval = false
                    }
                  }
                  if (this.addform.arraySecond.length > 0) {
                    if (!this.addform.arraySecond[0].name || !this.addform.arraySecond[0].subtitle || !this.addform.arraySecond[0].titlePicUrl || !this.addform.arraySecond[0].jumpUrl) {
                      this.secondHasval = true
                    } else {
                      this.secondHasval = false
                    }
                  }
                })
              }
            })
          }
        } else {
          this.resetData()
        }
      }
    },
    /*-----------------第一广告区-------------------*/
    firstAddfrom () {
      let newdata = {
        titlePicUrl: "",//主题图
        name: "",//服务名称
        subtitle: "",//服务副标题
        jumpUrl: "",
        setType: 2,
      }
      let newsecond = {
        titlePicUrl: "",//主题图
        name: "",//服务名称
        subtitle: "",//服务副标题
        jumpUrl: "",
        setType: 2,
      };
      this.addform.arrayFirst[1].push(newdata);
      this.addform.arrayFirst[1].push(newsecond);
    },
    firstDelfrom (index) {
      this.addform.arrayFirst[1].splice(index - 1, 2)
    },
    /*-----------------楼层广告区-------------------*/
    secondAddfrom () {
      let newdata = {
        jumpUrl: "",//跳转链接
        titlePicUrl: "",//主题图
        setType: 3,
      };
      this.addform.arraySecond.push(newdata);
    },

    secondDelfrom (index) {
      this.addform.arraySecond.splice(index, 1)
      if (this.addform.arraySecond.length == 0) {
        this.secondHasval = false
      }
    },
    /*-----------------快捷入口区-------------------*/
    lastAddfrom () {
      let newdata = {
        name: "",//服务名称
        titlePicUrl: "",//主题图
        jumpUrl: "",//跳转链接
        setType: 5,
      };
      this.addform.arrayLast[1].push(newdata);
    },
    lastDelfrom (index) {
      if (this.addform.arrayLast[1].length > 1) {
        this.addform.arrayLast[1].splice(index, 1)
      } else {
        this.$notify.error({
          title: '移除失败',
          position: 'top-left',
          message: '楼层广告区域最少为1个'
        });
      }
    },
    // 第一部分上传图片
    dynamicPicSuccess (obj, res, file) {
      var imgList = this.addform.arrayFirst[1]
      var index = obj.index;
      this.firstval=true;
      imgList[index].titlePicUrl = res.data;
      Success("上传图片成功!")
    },
    // 第二部分上传图片
    dynamicPicSuccess2 (obj, res, file) {
      var imgList = this.addform.arraySecond
      var index = obj.index;
      if (res.code == "0") {
        imgList[index].titlePicUrl = res.data;
        this.secondHasval = true
        this.$forceUpdate
        console.log(this.secondHasval);
        Success("上传图片成功!")
      }
    },
    // 第二部分上传图片
    dynamicPicSuccess3 (obj, res, file) {
      var imgList = this.addform.arrayLast[1]
      var index = obj.index;
      if (res.code == "0") {
        imgList[index].titlePicUrl = res.data;
        Success("上传图片成功!")
      }
    },
    beforeUploadImg (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(file.type) == -1) {
        this.$message.error("只支持上传'png','jpg','jpeg','gif'格式图片!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!');
        return false;
      }
    },
    beforeUploadImg2 (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) == -1) {
        this.$message.error("只支持上传'png','jpg','jpeg'格式图片!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!');
        return false;
      }
    },
    beforeUploadImg3 (file) {
      const isLt10K = file.size / 1024 <= 10;
      if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) == -1) {
        this.$message.error("只支持上传'png','jpg','jpeg'格式图片!");
        return false;
      }
      if (!isLt10K) {
        this.$message.error('上传图片大小不能超过10KB!');
        return false;
      }
    },
    inputFirst (index) {
      let newArray = this.addform.arrayFirst[1][index]
      let newArray2 = {}
      if (index % 2 == 0) {
        newArray2 = this.addform.arrayFirst[1][index + 1]
      } else {
        newArray2 = this.addform.arrayFirst[1][index - 1]
      }
      if (newArray.name || newArray.subtitle || newArray.titlePicUrl || newArray.jumpUrl || newArray2.name || newArray2.subtitle || newArray2.titlePicUrl || newArray2.jumpUrl) {
        this.firstval = true
      } else if (!newArray.name && !newArray.subtitle && !newArray.titlePicUrl && !newArray.jumpUrl && !newArray2.name && !newArray2.subtitle && !newArray2.titlePicUrl && !newArray2.jumpUrl) {
        this.firstval = false
      }
    },
    // 楼层广告区域根据判断是否输入值判断是否开启验证
    inputJumpUrl (jumpUrl,titlePicUrl) {
      if (jumpUrl||titlePicUrl) {
        this.secondHasval = true
      } else {
        this.secondHasval = false
      }
    },
    inputFirsttop () {
      let newArray = this.addform.arrayFirst[0]
      if (newArray.name || newArray.subtitle || newArray.jumpUrl) {
        this.firstTopval = true
      } else {
        this.firstTopval = false
      }
    },
  },
  // destory:{

  // }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fbfcfe;
}

.marginle10 {
  margin-left: 10px;
}
.marginb {
  margin-bottom: 20px;
}
.conOne {
  width: 45.8%;
  margin-bottom: 30px;
  border: 1px solid transparent;
}
.TitTopfon {
  line-height: 40px;
  width: 20%;
  margin: 0 auto;
  padding-bottom: 20px;
  text-align: center;
  font-weight: 900;
  font-size: 25px;
  background-clip: text;
  color: transparent;
  border: 1px solid transparent;
}
.Tittop {
  background-image: linear-gradient(to right, #ef77ff 0%, #692ab1 100%);
}
.Titles {
  width: 20%;
  margin: 0 auto;
  text-align: center;
  font-weight: 900;
  font-size: 22px;
  background-clip: text;
  color: transparent;
}
.Titles_one {
  background-image: linear-gradient(to right, #ff8177 0%, #b12a5b 100%);
}
.Titles_two {
  background-image: linear-gradient(to right, #ff8177 0%, #b12a5b 100%);
}
.Titles_three {
  background-image: linear-gradient(to right, #ff8177 0%, #b12a5b 100%);
  &::before {
    content: "*";
  }
}
.el-divider__text {
  font-size: 20px !important;
  .divider_icon {
    padding-right: 10px;
    cursor: pointer;
    .icon_one {
      font-size: 24px;
      color: yellowgreen;
      &:hover {
        color: rgb(185, 230, 96);
      }
    }
    .icon_two {
      font-size: 24px;
      color: #f56c6c;
      &:hover {
        color: #f38787;
      }
    }
  }
}
.tit_Tips {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
  margin: 10px 0 -10px;
}
.careful_text {
  .el-divider__text,
  .el-link {
    color: #303133;
    font-size: 14px !important;
  }
}
.upload_box {
  display: flex;
  justify-content: start;
}

.el-form-item {
  max-height: 90px;
  .img_box {
    width: 80px;
    height: 80px;
    overflow: hidden;
  }
}
</style>
