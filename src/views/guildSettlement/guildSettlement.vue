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
        <el-form-item prop="guildName" label="公会名称:">
          <el-input
            placeholder="请输入公会名称"
            v-model="searchdata.guildName"
            maxlength="11"
            @clear="fetchData()"
            style="width: 200px"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="mzUserId" label="会长ID:">
          <el-input
            placeholder="请输入会长ID"
            v-model="searchdata.mzUserId"
            maxlength="11"
            style="width: 150px"
            @clear="fetchData()"
            @input="changeSeID"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="status" label="账号状态:">
          <el-select
            v-model="searchdata.status"
            placeholder="请选择"
            clearable
            style="wdith: 150px"
            @clear="fetchData()"
          >
            <el-option
              v-for="item in accStateLi"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()">查询</el-button>
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
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        @selection-change="handleSelectionChange"
        @sort-change="clicksort"
      >
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
          prop="totalJBalance"
          align="center"
          sortable="custom"
          :resizable="false"
          label="总获取打赏找票(未分账)"
        >
        </el-table-column>
        <el-table-column
          :prop="lable.pro"
          align="center"
          width="150"
          :resizable="false"
          :label="lable.labels"
          v-for="lable in tablistsec"
          :key="lable.pro"
        >
        </el-table-column>
        <el-table-column
          prop="statu"
          align="center"
          width="80"
          :resizable="false"
          label="账号状态"
        >
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.statu == '正常'"
              type="success"
              :underline="false"
              >{{ scope.row.statu }}</el-link
            >
            <el-link v-else type="danger" :underline="false">{{
              scope.row.statu
            }}</el-link>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          width="100"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickEdit(scope.row)"
              >结算详情</el-button
            >
          </template>
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
import { guildSettlementlist } from "@/api/guild/Settlement";
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
  data() {
    return {
      filetext: "公会结算列表",
      filename: "公会结算列表",
      multipleSelection: [], //勾选的
      tHeader: [
        "公会名称",
        "会长ID",
        "平台分成",
        "会长获取找票数",
        "主播获取找票数",
        "会长已提现金额",
        "会长待提现金额",
        "账号状态"
      ], //导出组件头部
      filterVal: [
        "guildName",
        "guildMzUserId",
        "platWithdrawProportions",
        "guildJBalance",
        "anchorJBalance",
        "withdrawalAmounts",
        "notWithdrawalAmounts",
        "statu"
      ], //导出组件头部对应值
      /*-------------勾选导出组件所需参数-------------*/
      list: null,
      loading: true,
      downloadLoading: false,
      searchdata: {
        page: 1,
        rows: 15,
        guildName: "",
        mzUserId: "",
        status: "",
        sort: "", //排序方式 0-降序 1-升序
        sortType: 1
      },
      total: 0,
      tablist: [
        { pro: "guildName", labels: "公会名称" },
        { pro: "guildMzUserId", labels: "会长ID" },
        { pro: "platWithdrawProportions", labels: "平台分成" }
      ],
      tablistsec: [
        { pro: "guildJBalance", labels: "会长获取找票数" }, //??
        { pro: "anchorJBalance", labels: "主播获取找票数" },
        { pro: "withdrawalAmounts", labels: "会长已提现金额" },
        { pro: "notWithdrawalAmounts", labels: "会长待提现金额" }
      ],
      // status	integer($int32) 账号状态:0-正常 1-清退
      tableData: [],
      accStateLi: [
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "清退"
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    changeSeID() {
      let value = this.searchdata.mzUserId;
      if (value.length == 1) {
        this.searchdata.mzUserId = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.mzUserId = value.replace(/\D/g, "");
      }
    },
    fetchData() {
      this.loading = true;
      guildSettlementlist(this.searchdata).then(response => {
        if (response.code == 0) {
          if (response.data.total > 0) {
            this.tableData = this.changeVal(response.data.records, "guilds");
          } else {
            this.tableData = response.data.records;
          }
          this.total = response.data.total;
          this.searchdata.sort = "";
        }
        this.loading = false;
      });
    },
    clickEdit(row) {
      this.$store.dispatch("guild/setGuildid", row.guildId);
      this.$router.push("/guild/guildsetdetails");
    },
    clickReset() {
      this.$refs.searchdata.resetFields(); //重置表单
      this.fetchData();
    },
    // 重置勾选
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clicksort(column) {
      if (column.order == "ascending") {
        this.searchdata.sort = 0;
      } else if (column.order == "descending") {
        this.searchdata.sort = 1;
      } else {
        this.searchdata.sort = "";
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
