<template>
  <div class="contanier">
    <selectexeport
      :filetext="filetext"
      :filename="filename"
      :multipleSelection="multipleSelection"
      :tHeader="tHeader"
      :filterVal="filterVal"
    />
    <div class="head">
        <div>
            <span>类别：</span>
            <el-select v-model="category" placeholder="请选择" clearable  style="width:100px">
                <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>

      <div class="status">
        <span>审核状态：</span>
        <el-select v-model="status" clearable  placeholder="请选择" style="width:150px">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="user-type">
        <span>用户类型：</span>
        <el-select v-model="userType" clearable  placeholder="请选择" style="width:120px">
          <el-option
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="tiem">
        <span>时间：</span>
        <el-date-picker
          class="picker-time"
          v-model="date"
          type="daterange"
          range-separator="~"
          
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div>
        <span>用户ID：</span>
        <el-input 
          v-model="searchUserId"
          placeholder="输入用户ID"
          class="search-value"
          clearable
          @input="changeSeID"
        ></el-input>
      </div>
      <div>
        <span>视频标题：</span>
        <el-input 
          clearable
          v-model="searchVideoTitle"
          placeholder="输入视频标题"
          class="search-value"
          
        ></el-input>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          
          @click="searchHandle"
          >查询</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-folder-opened"
          
          @click="auditHandle(multipleSelection)"
          >批量审核</el-button
        >
      </div>
    </div>

    <!-- 主体表格 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="600"
        max-height="600"
        border
        cell-class-name="t-cell"
        header-cell-class-name="t-cell"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="videoId" label="短视频ID" width="120">
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="120">
        </el-table-column>
        <el-table-column prop="nickName" width="120" label="用户昵称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="title"
          label="短视频标题"
          show-overflow-tooltip
          width="120"
        >
        </el-table-column>
        <el-table-column prop="topicName" label="参与话题" width="120">
        </el-table-column>
        <el-table-column label="视频内容" width="120">
          <template slot-scope="scope">
            <!-- {{ scope.row.videoUrl }} -->
            <el-link type="primary" @click="lookVideo(scope.row)"
              >点击查看</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="类别" width="120">
        </el-table-column>
        <el-table-column
          prop="createTimeFormat"
          label="发布时间"
          show-overflow-tooltip
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="reason"
          label="处理意见"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">待审核</span>
            <span v-if="scope.row.status == 1">已通过</span>
            <span v-if="scope.row.status == 2">未通过</span>
            <span v-if="scope.row.status == -1">七牛云审核中</span>
          </template>
        </el-table-column>
        <el-table-column label="视频标签" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            {{ scope.row.tags && scope.row.tags.replace(/,/g, '/') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              class="el-btn-mini"
              type="primary"
              size="mini"
              @click="auditOne(scope.row)"
              >审核</el-button
            >
            <el-button
              v-if="scope.row.status != -1"
              class="el-btn-mini"
              type="primary"
              size="mini"
              @click="markHandle(scope.row)"
              >标签</el-button
            >
            <span v-else>——</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      style="text-align: left; margin-top: 10px"
      :total="total"
      :page-sizes="[10,20,50,100,1000,5000]"
      :page-size="params.limit"
      :current-page="params.page"
      @current-change="currentChange($event)"
      @size-change="sizeChange($event)"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog
      :title="lookVideoItem.title"
      :visible.sync="dialogTableVisible"
      class="mark"
    >
      <video :src="lookVideoItem.videoUrl" muted controls></video>
    </el-dialog>
    <!-- 标签弹框 -->
    <select-mark
      v-if="isShowMark"
      ref="selectMark"
      :videoID="videoId"
      :tags="tags"
      @suerClick="getData"
    />
    <!-- 审核弹框 -->
    <el-dialog
      title="审核"
      :visible.sync="dialogTableVisibleAudit"
      class="mark-audit"
    >
      <div class="title">
        审核：
        <el-radio-group v-model="radioAudit" @change="radioHandle">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">不通过</el-radio>
        </el-radio-group>
      </div>
      <div class="body" v-if="radioAudit == 2">
        <el-select
          size="mini"
          v-model="rejectB.value"
          placeholder="请选择原因"
          @change="auditSelectChange"
        >
          <el-option
            v-for="item in rejectB.options"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div v-if="rejectB.value == '自定义'" class="text">
          <el-input
            type="textarea"
            placeholder="请输入拒绝原因"
            v-model="rejectB.textarea"
          >
          </el-input>
        </div>
      </div>

      <div class="foot">
        <el-button type="primary" size="small" @click="comitAudit"
          >确认</el-button
        >
        <el-button type="info" size="small" @click="cancleHandle"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectMark from '../../components/selectMark.vue'
import { getReVideoList, getCityVideoList, getCardVideoList, auditVideo, auditOneVideo } from '../../api/audity/recreation'
export default {
  components: {
    SelectMark
  },
  name: 'Recreation',
  data() {
    return {
      isShowMark: false,
      // 视频状态
      // 类别
        category:'',
        categoryOptions:[
            {
                label:'全部',
                value:''
            },
                {
                label:'房产',
                value:'2'
            },
            {
                label:'美食',
                value:'20'
            },
            {
                label:'酒店',
                value:'21'
            },
            {
                label:'景点',
                value:'22'
            },
            {
                label:'找车',
                value:'23'
            },
        ],
      status: '', // 0.待审核   1.已通过 2.未通过  -1.七牛云审核中
      statusOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '七牛云审核中',
          value: '-1'
        },
        {
          label: '待审核',
          value: '0'
        },
        {
          label: '已通过',
          value: '1'
        },
        {
          label: '未通过',
          value: '2'
        },
      ],
      // 用户类型
      userType: '', // 1,真实用户 2.机器人用户
      userTypeOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '真实用户',
          value: '1'
        },
        {
          label: '机器人用户',
          value: '2'
        },
      ],
      // 时间
      date: [],
      // 搜索关键字
      searchUserId: '',
      searchVideoTitle: '',
      // 表格数据
      tableData: [],
      multipleSelection: [],
      total: 0,
      params: {
        linit: 10,
        page: 1
      },
      dialogTableVisible: false,
      // 审核弹框控制
      dialogTableVisibleAudit: false,
      auditItem: null,
      radioAudit: '1', // 1.通过  2.不通过
      rejectB: {
        value: '画质不清晰',
        options: [
          {
            value: '画质不清晰',
          },
          {
            value: '含有第三方logo',
          },
          {
            value: '低俗色情',
          },
          {
            value: '血腥恐怖暴力',
          },
          {
            value: '违反国家法律法规',
          },
          {
            value: '含有敏感信息',
          },
          {
            value: '抄袭',
          },
          {
            value: '其它',
          },
          {
            value: '自定义',
          },
        ],
        textarea: '' // 自定义拒绝原因
      },
      // 查看视频
      lookVideoItem: {
        title: '',
        videoUrl: ''
      },
      // 点击标签时选中的视频id
      videoId: '',
      tags: '', // 已有标签
      filetext: '打卡视频审核',
      filename: '打卡视频审核',
      tHeader: ['短视频ID', '用户ID', '用户昵称', '短视频标题', '参与话题', '视频内容', '类别', '发布时间', '处理意见', '状态', '视频标签'],
      filterVal: ['videoId', 'userId', 'nickName', 'title', 'topicName', 'videoUrl', 'categoryName', 'createTimeFormat', 'reason', 'statusKey', 'tags'],
    }
  },
 
  mounted() {
    this.getData()
  },
  methods: {
    // 获取视频列表
    async getData() {

      let params = {
        categroy:this.category,
        status: this.status,
        userType: this.userType,
        startTime: (Array.isArray(this.date) && this.date.length > 0) ? this.date[0] : '',
        endTime: (Array.isArray(this.date) && this.date.length > 0) ? this.date[1] : '',
        userId: this.searchUserId,
        videoTitle: this.searchVideoTitle,
        page: this.params.page,
        rows: this.params.linit
      }
      let res = await getCardVideoList(params)
        
      
      if (res.code == 0) {
        this.tableData = res.data.records.map(e => {
          if (e.status == 0) {
            e.statusKey = '待审核'
          } else if (e.status == 1) {
            e.statusKey = '已通过'
          } else if (e.status == 2) {
            e.statusKey = '未通过'
          } else if (e.status == -1) {
            e.statusKey = '七牛云审核中'
          }
          e.createTimeFormat = (e.createTime && this.changedata(e.createTime))
          return e
        })
        
        this.total = res.data.total
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;

    },
    currentChange(e) {
      this.params.page = e
      this.getData()
    },
    sizeChange(e) {
      this.params.linit = e
      this.getData()
    },
    // 查看视频
    lookVideo(item) {
      
      this.lookVideoItem = item
      this.dialogTableVisible = true
    },
    // 批量审核处理
    async auditHandle(ids) {
      
      if (ids.length > 0) {
        ids = ids.map(e => e.videoId).join(',')
        let res = await auditVideo({ ids })
        
        if (res.code == 0) {
          this.getData()
        }
      }
    },
    /*-------------------------------------------------------------------*/
    // 单独一个审核,打开审核弹框
    auditOne(item) {
      
      this.radioAudit = '1'
      this.rejectB.value = '画质不清晰'
      this.rejectB.textarea = ''
      this.dialogTableVisibleAudit = true
      this.auditItem = item
    },
    // 单选改变时触发
    radioHandle() {

    },
    //  下拉框改变时
    auditSelectChange() {

    },
    // 关闭审核弹窗
    cancleHandle() {
      this.dialogTableVisibleAudit = false
    },
    // 提交审核
    async comitAudit() {
     
      let params = {
        reason: this.radioAudit == '1'? '' : this.rejectB.value == '自定义' ? this.rejectB.textarea : this.rejectB.value,
        status: this.radioAudit,
        topicId: this.auditItem.topicId,
        type: this.auditItem.categoryId,
        userId: this.auditItem.userId,
        videoId: this.auditItem.videoId
      }
      let res = await auditOneVideo(params)
      
      if (res.code == 0) {
        this.cancleHandle()
        this.getData()
        this.Success('审核完成')
      }
    },
    /*-------------------------------------------------------------------*/

    // 查询
    async searchHandle() {
      this.params.page = 1
      this.getData()
    },
    // 导出
    excelHandle() {



    },
    clearmultiple() {
      this.multipleSelection = []
    },
    // 打开标签弹框
    markHandle({ videoId, tags }) {
      this.videoId = videoId + ''
      this.tags = tags
      this.isShowMark = true
      setTimeout(() => {
        this.$refs.selectMark.dialogFormVisible = true
      }, 0)
    },
    changeSeID(){
        let value = this.searchUserId
        if(value.length ==1){
            this.searchUserId=value.replace(/[^0-9]/g,'')
        }else{
            this.searchUserId=value.replace(/\D/g,'')
        }
    },

  }
}
</script>

<style lang="scss" scoped>
.contanier {
  padding: 10px 20px 20px 20px;
  .head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 0;
    & > div {
      margin:  10px;
      &>span{
        font-weight: 700;
        font-size: 14px;
        color: #606266;
      }
    }
    .el-select {
      width: 107px;
    }
    .picker-time {
      width: 260px;
    }
    .search-value {
      width: 160px;
        
    }
  }
  .el-input {
    display: inline-block;
    width: auto;
  }
  .table {
    ::v-deep.t-cell {
      text-align: center;
    }
    .el-btn-mini {
      padding: 4px;
    }
  }
  .mark {
    ::v-deep.el-dialog__header span {
      display: inline-block;
      width: 400px;
      overflow: hidden;
    }
    video {
      display: block;
      width: 900px;
      height: 500px;
      margin: 0 auto;
    }
  }
  .mark-audit {
    ::v-deep.el-dialog {
      width: 500px;
    }
    ::v-deep.el-dialog__body {
      position: relative;
      height: 350px;
    }
    .title {
      text-align: center;
    }
    .body {
      text-align: center;
      padding-top: 10px;
      .text {
        width: 300px;

        margin: 10px auto;
        ::v-deep textarea {
          height: 180px;
          resize: none;
        }
      }
    }
    .foot {
      position: absolute;
      bottom: 0;
      left: 0;
      margin: 20px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>