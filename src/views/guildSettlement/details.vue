<template>
  <div class="app-container">
    <selectexeport
      :filename="filename"
      :filetext="filetext"
      :multipleSelection="multipleSelection"
      :tHeader="tHeader"
      :filterVal="filterVal"
    />
    <div id="search_box">
      <el-form
        :model="searchdata"
        ref="searchdata"
        :inline="true"
        size="normal"
      >
        <el-form-item prop="beginTime" label="日期:" style="margin:0">
          <el-date-picker
            style="width: 170px;marginRight:0"
            v-model="searchdata.beginTime"
            type="date"
            align="right"
            placeholder="开始时间"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            @clear="clickSearch()"
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
            @clear="clickSearch()"
          />
        </el-form-item>
        <el-form-item prop="platWithdrawProportions" label="平台分成:">
          <el-input
            placeholder="平台分成"
            v-model="searchdata.platWithdrawProportions"
            maxlength="3"
            @clear="clickSearch()"
            clearable
            style="width: 150px"
          >
            <span class="getcode" slot="suffix">%</span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="clickSearch()"
            >查询</el-button
          >
          <el-button @click="clickReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        @sort-change="clicksort"
      >
        <!-- :default-sort="{prop: 'date', order: 'descending'}" -->
        <el-table-column type="selection" width="40" :resizable="false">
        </el-table-column>
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
          :prop="lable.pro"
          align="center"
          sortable="custom"
          :resizable="false"
          :label="lable.labels"
          v-for="lable in tablistlast"
          :key="lable.pro"
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
import { guildSettlementdetail } from "@/api/guild/Settlement";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    if (this.$store.state.guild.guildId) {
      sessionStorage.guildId = this.$store.state.guild.guildId;
    }
    this.searchdata.guildId = sessionStorage.guildId;
    this.fetchData();
  },
  data() {
    return {
      filetext: "公会结算详情",
      filename: "公会结算详情", //导出的文件名
      multipleSelection: [], //勾选的
      tHeader: [
        "日期",
        "平台分成",
        "分佣比例",
        "获取打赏找票(未分账)",
        "会长获取找票数",
        "主播获取找票数"
      ], //导出组件头部
      filterVal: [
        "createTimes",
        "platWithdrawProportions",
        "commissionRatios",
        "totalJBalance",
        "guildJBalance",
        "anchorJBalance"
      ], //导出组件头部对应值
      /*---------------------导出勾选项所需参数----------------------*/
      list: null,
      loading: true,
      timeError: null,
      sear_PayDate: [],
      searchdata: {
        page: 1,
        rows: 15,
        beginTime: "", //开始时间
        endTime: "", //结束时间
        guildId: "", //公会id
        platWithdrawProportions: "", //平台分成用户输入的
        platWithdrawProportion: "", //平台分成接口需要的
        guildId: "", //公会ID
        sort: "", //排序方式 0-降序 1-升序
        sortType: "", //排序类型 获取打赏找票（未分账）
        type: 0 //结算类型:0-公会 1-主播
      },
      total: 0,
      tablist: [
        { pro: "createTimes", labels: "日期" },
        { pro: "platWithdrawProportions", labels: "平台分成" }
        // { pro: "commissionRatios", labels: "分佣比例" },
      ],
      tablistlast: [
        { pro: "totalJBalance", labels: "获取打赏找票(未分账)" } //排序
      ],
      tablistsec: [
        { pro: "guildJBalance", labels: "会长获取找票数" },
        { pro: "anchorJBalance", labels: "主播获取找票数" }
      ],
      tableData: []
    };
  },
  methods: {
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选
    clickSearch() {
      if (this.searchdata.platWithdrawProportions) {
        this.searchdata.platWithdrawProportion =
          this.searchdata.platWithdrawProportions / 100;
      } else {
        this.searchdata.platWithdrawProportion = "";
      }
      this.fetchData();
    },
    compareDate() {
      if (
        new Date(this.searchdata.beginTime) -
          new Date(this.searchdata.endTime) >
        1
      ) {
        this.timeError = "结束时间应在开始时间之后！";
        return false;
      } else {
        this.timeError = null;
        return;
      }
    },
    fetchData() {
      this.compareDate();
      // this.loading = false//   模拟 需删除
      this.loading = true;
      guildSettlementdetail(this.searchdata).then(response => {
        if (response.code == 0) {
          this.tableData = response.data.records.map(item => {
            if (item.createTime) {
              item.createTimes = this.changedatano(item.createTime);
            } else {
              item.createTimes = "--";
            }
            if (item.platWithdrawProportion) {
              item.platWithdrawProportions = `${item.platWithdrawProportion *
                100}%`;
            } else {
              item.platWithdrawProportions = "--%";
            }
            if (item.commissionRatio) {
              item.commissionRatios = `${item.commissionRatio}%`;
            } else {
              item.commissionRatio = "--%";
            }
            return item;
          });
          this.searchdata.sort = "";
        }
        this.loading = false;
      });
    },
    clickReset() {
      this.$refs.searchdata.resetFields(); //重置表单
      this.searchdata.platWithdrawProportion = "";
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }, //改变勾选
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
      this.fetchData();
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData();
    }
  }
};
</script>
<style lang="scss" scoped>
#search_box {
  margin-bottom: 20px;
  padding-left: 15px;
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
.getcode {
  display: inline-block;
  margin-right: 10px;
}
</style>
