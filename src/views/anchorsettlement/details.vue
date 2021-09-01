<template>
  <div class="app-container">
    <selectexeport
          :filename="filename"
          :filetext="filetext"
          :multipleSelection="multipleSelection"
          :tHeader="tHeader"
          :filterVal="filterVal"
        />
    <el-form :model="searchdata" ref="searchdata" :inline="true" size="normal">
      <el-form-item prop="beginTime" label="日期:">
        <el-date-picker
          style="width: 170px;marginLeft:10px"
          v-model="searchdata.beginTime"
          type="date"
          align="right"
          placeholder="开始时间"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item prop="endTime" :error="timeError">
        <el-date-picker
          style="width: 170px"
          v-model="searchdata.endTime"
          type="date"
          align="right"
          placeholder="结束时间"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button @click="clickReset()">重置</el-button>
      </el-form-item>
    </el-form>
      <!-- 表格 -->
      <div class="tab_box">
        <el-table
          :data="tableData"
          ref="tableData"
          v-loading="loading"
          element-loading-text="数据加载中"
          max-height="600"
          height="600"
          border
          :header-cell-style="{background:'#EBE278',color:'#7D7D7D'}"
          @selection-change="handleSelectionChange"
          @sort-change="clicksort"
        >
          <el-table-column type="selection" width="40" :resizable="false"> </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="(lable, index) in tablist"
            :key="index"
          >
          </el-table-column>
          <el-table-column
            prop="totalJBalance"
            align="center"
            sortable="custom"
            :resizable="false"
            label="获取打赏找票(未分账)"
          >
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablistsec"
            :key="lable.pro"
          >
          </el-table-column>
        </el-table>
      </div>
    <!-- 翻页 -->
    <div id="paging" style="margin-top: 30px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchdata.page"
        :page-sizes="[10, 20, 40, 60, 80]"
        :page-size="searchdata.rows"
        prev-text="上一页"
        next-text="下一页"
        background
        layout="total,prev,pager,next,sizes,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { anchorSettlementdetail } from '@/api/guild/Settlement'
export default {
  created() {
    if (this.$store.state.guild.anchorId) {
      sessionStorage.anchorId = this.$store.state.guild.anchorId
    }
    this.searchdata.anchorId = sessionStorage.anchorId
    this.fetchData()
    // this.List(allPayManlist)
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      filetext: "主播结算详情",
      filename: "主播结算详情",
      multipleSelection: [],//勾选的
      tHeader: ["日期", "平台分成", "分佣比例", "获取打赏找票（未分账）", "会长获取找票数", "主播获取找票数"],//导出组件头部
      filterVal: ["createTimes", "platWithdrawProportions", "commissionRatios", "totalJBalance", "guildJBalance", "anchorJBalance"],//导出组件头部对应值
      /*-------------勾选导出组件所需参数-------------*/
      timeError: null,
      list: null,
      loading: true,
      sear_PayDate: "",
      searchdata: {
        page: 1,
        rows: 15,
        beginTime: "",
        endTime: "",
        sort: "",
        sortType: "",
        anchorId: "",
        type: 1
      },
      total: 0,
      tablist: [
        { pro: "createTimes", labels: "日期" },
        { pro: "platWithdrawProportions", labels: "平台分成" },
        { pro: "commissionRatios", labels: "分佣比例" },
      ],
      tablistsec: [
        { pro: "guildJBalance", labels: "会长获取找票数" },
        { pro: "anchorJBalance", labels: "主播获取找票数" },
      ],
      tableData: [],
    }
  },

  methods: {
    compareDate() {
      if (new Date(this.searchdata.beginTime) - new Date(this.searchdata.endTime) > 1) {
        this.timeError = "结束时间应在开始时间之后！"
        return false
      } else {
        this.timeError = null
        return
      }
    },
    fetchData() {
      this.compareDate()
      this.loading = true
      anchorSettlementdetail(this.searchdata).then(response => {
        if (response.code == 0) {
          this.total = response.data.total
          if (response.data.total > 0) {
            this.tableData = this.changeVal(response.data.records, "anchordeil")
            this.tableData.map(item => {
              item.createTimes = this.changedatano(item.createTime)
              return item
            })
          } else {
            this.tableData = response.data.records
          }
          this.searchdata.sort = ""
        }
        this.loading = false
      })
    },
    clickSearch() {

    },
    clickReset() {
      this.$refs.searchdata.resetFields()//重置表单
      this.fetchData()
    },
    // 重置勾选
    clearmultiple() {
      this.$refs.tableData.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clicksort(column) {
      if (column.order == "ascending") {
        this.searchdata.sort = 1;
        this.searchdata.sortType = 1;
      } else if (column.order == "descending") {
        this.searchdata.sort = 0;
        this.searchdata.sortType = 1;
      } else {
        this.searchdata.sort = "";
        this.searchdata.sortType = "";
      }
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize
      this.fetchData()
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage
      this.fetchData()
    },
  }
}
</script>
<style lang="scss" scoped>
#search_box {
  margin: 0 0 20px 15px;
  display: flex;
  justify-content: flex-start;
  .el-input {
    margin: 0 15px;
    width: 330px;
  }
  .el-button {
    margin: 0 15px;
  }
}
.con_main {
  padding: 0 15px;
  .btn_box {
    margin-bottom: 20px;
  }
}
</style>
