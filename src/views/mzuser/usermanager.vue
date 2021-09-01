<template>
  <div class="app-container">
    <div id="search_box">
      <el-form
        :model="searchdata"
        ref="searchdata"
        :inline="true"
        size="normal"
      >
        <el-row :gutter="24">
          <el-col
            :span="4.5"
            v-for="item in search_list_select"
            :key="item.lab"
          >
            <el-form-item :prop="item.pro" :label="item.lab">
              <el-select
                v-model="searchdata[item.lab]"
                placeholder="请选择"
                clearable
                style="width: 150px; marginleft: 10px"
                @clear="clickSearch()"
              >
                <el-option
                  v-for="items in item.list"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="15.6">
            <el-form-item label="注册时间:">
              <el-date-picker
                style="margin-right: 15px"
                v-model="sear_PayDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="clickSearch()"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="输入手机号、用户ID、用户昵称进行搜索"
                v-model="searchdata.search"
                maxlength="11"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="clickSearch()">查询</el-button>
              <el-button @click="clickReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="con_main">
      <div class="btn_box">
        <!--<el-button type="primary" @click="clickadd()">添加公会</el-button>-->
        <!--导出-->
        <selectexeport
          :filename="filename"
          :multipleSelection="multipleSelection"
          :tHeader="tHeader"
          :filterVal="filterVal"
        />
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
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#EBE278', color: '#7D7D7D' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <!-- fixed="left" -->
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="(lable, index) in tablist"
            :key="index"
          />
          <el-table-column
            prop="status"
            align="center"
            width="80"
            :resizable="false"
            label="状态"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeState(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <!-- fixed="right" -->
          <el-table-column
            label="操作"
            width="202"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="clickEdit(scope.row)"
                >用户详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页 -->
    <div id="paging" style="margin-top: 30px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchdata.page"
        :page-sizes="[10, 20, 50, 100, 1000, 5000]"
        :page-size="searchdata.limit"
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
import { mzUserlist } from "@/api/oldmanager/mzUser";
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
    // 验证函数
    const validauid = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入ID!"));
      } else {
        callback();
      }
    };
    const validaphone = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入手机号码!"));
      } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
        callback(new Error("号码错误请重新输入!"));
      } else {
        callback();
      }
    };
    const validaratio = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择设置平台分成!"));
      } else if (value < 25 || value > 50) {
        callback(new Error("设置费率不符合条件!"));
      } else {
        callback();
      }
    };
    return {
      filename: "用户管理", //导出的文件名
      // downloadLoading: false,
      multipleSelection: [], //勾选的
      tHeader: [], //导出组件头部
      filterVal: [], //导出组件头部对应值
      /*--------------勾选导出组件所需参数-------------*/
      // 验证
      rules: {
        mzUserId: [{ validator: validauid, trrigger: "blur" }],
        phone: [
          { required: true, message: "请填写手机号!", trigger: "blur" },
          { validator: validaphone, trrigger: ["change", "blur"] }
        ],
        guildName: [
          { required: true, message: "请输入公会名称!", trigger: "blur" },
          { min: 2, max: 10, message: "长度限制在2-10字符!", trigger: "blur" }
        ],
        proportion: [{ validator: validaratio, trrigger: "blur" }]
      },
      // 搜索下拉选择循环
      sear_PayDate: "",
      search_list_select: [
        {
          pro: "status",
          lab: "用户状态:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "已禁用" },
            { value: 1, label: "已启用" }
          ]
        },
        {
          pro: "userLv",
          lab: "用户等级:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "1级" },
            { value: 1, label: "2级" },
            { value: 2, label: "3级" },
            { value: 3, label: "4级" },
            { value: 4, label: "5级" }
          ]
        },
        {
          pro: "accountType",
          lab: "账号类型:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "虚拟账号" },
            { value: 1, label: "真实用户" }
          ]
        },
        {
          pro: "userType",
          lab: "用户类型:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "普通用户" },
            { value: 1, label: "商家" },
            { value: 2, label: "店铺" },
            { value: 3, label: "官方" }
          ]
        },
        {
          pro: "shopType",
          lab: "店铺类型:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "美食" },
            { value: 1, label: "住宿" },
            { value: 2, label: "景区" },
            { value: 3, label: "车产" },
            { value: 4, label: "房产" }
          ]
        }
      ],
      /*-------------------------------------------------------*/
      list: null,
      // loading: true,
      loading: false,
      // adddialog: false,
      // 表单错误信息
      idError: null,
      phoneError: null,
      searchdata: {
        page: 1,
        // rows: 20,
        limit: 10,
        status: "",
        shopType: "",
        search: "",
        userLv: "",
        userType: "",
        accountType: "",
        createTime: "",
        endTime: ""
      },
      total: 0,
      tablist: [
        { pro: "userId", labels: "用户ID" },
        { pro: "info", labels: "用户信息" },
        { pro: "userLv", labels: "用户等级" },
        { pro: "userTypes", labels: "用户类型" },
        { pro: "withdrawProportion", labels: "提现费率" },
        { pro: "fans", labels: "粉丝" }
      ],
      tableData: []
    };
  },
  created() {
    // this.fetchData()
  },
  methods: {
    changeState(row) {
      console.log("状态改变", row);
    },
    //搜索部分
    changeSeID() {
      let value = this.searchdata.guildMzUserId;
      if (value.length == 1) {
        this.searchdata.guildMzUserId = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.guildMzUserId = value.replace(/\D/g, "");
      }
    },
    //添加部分
    changeID() {
      let value = this.addform.mzUserId;
      if (value.length == 1) {
        this.addform.mzUserId = value.replace(/[^0-9]/g, "");
      } else {
        this.addform.mzUserId = value.replace(/\D/g, "");
      }
    },
    changePhone() {
      let value = this.addform.phone;
      if (value.length == 1) {
        this.addform.phone = value.replace(/[^0-9]/g, "");
      } else {
        this.addform.phone = value.replace(/\D/g, "");
      }
    },
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
    // blurphone() {
    //   let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/
    //   if (!phonereg.test(this.addform.phone)) {
    //     this.phoneError = "请输入正确的手机格式!"
    //   }
    // },
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
      // this.loading = true
      mzUserlist(this.searchdata).then(response => {
        this.$nextTick(() => {
          this.$refs.tableData.doLayout();
        });
        this.loading = false;
      });
    },
    clickEdit(row) {
      console.log("点击了详情");
      // this.$store.dispatch('guild/setGuildid', row.guildId)
      // sessionStorage.guildId=row.guildId
      // this.$router.push('/guildmanage/guilddetails')
    },
    resetform() {
      this.$nextTick(() => {
        this.$refs.addform.resetFields(); //重置表单
        this.fetchData();
      });
    },
    clickSearch() {
      this.fetchData();
    },
    clickReset() {
      this.$refs.searchdata.resetFields(); //重置表单
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.searchdata.limit = pageSize;
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
.slots--left {
  margin-right: 15px;
}
.slots--right {
  margin-left: 15px;
}
::v-deep .table {
  border: 3px solid grey !important;
}
.el-range-editor.el-input__inner{
      margin-left: 10px !important;
}
</style>
