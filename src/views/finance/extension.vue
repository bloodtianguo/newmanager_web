<template>
  <div class="app-container">
  <selectexeport
          :filetext="filetext"
          :filename="filename"
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
        <el-form-item prop="userId" label="推广人ID:">
         <el-input
            placeholder="请输入推广人ID"
            v-model="searchdata.userId"
            maxlength="6"
            @clear="clickSearch()"
            clearable
            style="width: 200px"
            @input="changeSeID"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
          </el-input>
        </el-form-item>
        <el-form-item prop="guildMzUserId" label="时间:">
         <el-date-picker
            style="margin-left: 15px;width:250px"
            v-model="sear_PayDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="clickSearch()"
          />
        </el-form-item>
        <el-form-item style="margin-left:15px">
          <el-button type="primary" @click="clickSearch()">查询</el-button>
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
          border
          max-height="600"
          height="600"
         :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :label="lable.labels"
            :resizable="false"
            v-for="(lable, index) in tablist"
            :key="index"
          />
        </el-table>
      </div>
    <!-- 翻页 -->
    <div id="paging" style="margin-top: 30px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchdata.page"
        :page-sizes="[10, 20, 50, 100, 1000,5000]"
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
import { marketProfits } from "@/api/finance/extension";
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
        // { pro: "nickname", labels: "被打赏用户昵称" },
        // { pro: "lowerUserId", labels: "被打赏用户ID" },
        // { pro: "userId", labels: "推广人ID" },
        // { pro: "types", labels: "收益类型" },
        // { pro: "userProfit", labels: "收益(元)" },
        // { pro: "rewardTimes", labels: "入账时间" }
      filetext:"推广管理",
      filename: "推广管理", //导出的文件名
      multipleSelection: [], //勾选的
      tHeader: ["被打赏用户昵称","被打赏用户ID","推广人ID","收益类型","收益(元)","入账时间"], //导出组件头部
      filterVal: ["nickname","lowerUserId","userId","types","userProfit","rewardTimes"], //导出组件头部对应值
      /*--------------勾选导出组件所需参数-------------*/
      // 验证
      rules: {
        phone: [
          // { required: true, message: "请填写手机号!", trigger: "blur" },
          // { validator: validaphone, trrigger: ['change', 'blur'] }
        ]
      },
      list: null,
      loading: true,
      // 表单错误信息
      sear_PayDate:[],
      searchdata: {
        page: 1,
        rows: 10,
        userId:"",
        beginTime: "",//string
        endTime: ""
      },
      total: 0,
      tablist: [
        { pro: "nickname", labels: "被打赏用户昵称" },
        { pro: "lowerUserId", labels: "被打赏用户ID" },
        { pro: "userId", labels: "推广人ID" },
        { pro: "types", labels: "收益类型" },
        { pro: "userProfit", labels: "收益(元)" },
        { pro: "rewardTimes", labels: "入账时间" }
      ],
      tableData: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
      changeSeID() {
      let value = this.searchdata.userId
      if (value.length == 1) {
        this.searchdata.userId = value.replace(/[^0-9]/g, '')
      } else {
        this.searchdata.userId = value.replace(/\D/g, '')
      }
    },
    //搜索部分
    changeProp() {
      let value = this.addform.proportion;
      if (value.length == 1) {
        this.addform.proportion = value.replace(/[^0-9]/g, "");
      } else {
        this.addform.proportion = value.replace(/\D/g, "");
      }
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    tableHeaderClass() {
      return "tableHeader";
    },
    fetchData() {
      this.loading = true
      marketProfits(this.searchdata).then(response => {
        if(response.code=="0"){
            this.tableData=response.data.records.map(item=>{
              switch (item.type) {
                case 1:
                  item.types="打赏收益分红"
                 break;
                default:
                  item.types="--"
                  break;
              }
              item.rewardTimes=this.changedata(item.rewardTime)
              return item
            })
        }
        this.total=response.data.total
        this.loading = false
      })
    },
    resetform() {
      this.$nextTick(() => {
        this.$refs.addform.resetFields(); //重置表单
        this.fetchData();
      });
    },
    clickSearch() {
      if (this.sear_PayDate !== null) {
        this.searchdata.beginTime = this.sear_PayDate[0];
        this.searchdata.endTime = this.sear_PayDate[1];
        this.searchdata.page=1
        this.fetchData();
      } else {
        this.searchdata.beginTime = "";
        this.searchdata.endTime = "";
        this.searchdata.page=1
        this.fetchData();
      }
    },
    clickReset() {
      this.$refs.searchdata.resetFields(); //重置表单
      this.sear_PayDate="";
      this.searchdata.beginTime = "";
      this.searchdata.endTime = "";
      this.searchdata.page=1;
      this.searchdata.rows=10;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
.slots--left {
  margin-right: 15px;
}
.slots--right {
  margin-left: 15px;
}
::v-deep .table {
  border: 3px solid grey !important;
}
</style>
