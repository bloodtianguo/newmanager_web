<template>
  <div class="app-container">
    <!--导出-->
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
        <el-form-item
          style="margin-right:20px"
          v-for="item in search_list_select"
          :key="item.lab"
          :label="item.lab"
          :prop="item.pro"
        >
          <el-select
            v-model="searchdata[item.pro]"
            placeholder="请选择"
            clearable
            style="width: 120px; marginleft: 10px"
            @clear="clickSearch()"
            @change="changetype(item.lab)"
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
        <el-form-item prop="userId" label="用户ID:">
          <el-input
            style="width: 150px;"
            placeholder="请输入用户ID"
            v-model="searchdata.userId"
            maxlength="6"
            @input="changeSeID"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            @clear="clickSearch()"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号:">
          <el-input
            style="width: 152px;"
            placeholder="请输入手机号"
            v-model="searchdata.phone"
            maxlength="11"
            @clear="clickSearch()"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="orderNo" label="订单号:">
          <el-input
            style="width: 320px;"
            placeholder="请输入订单号"
            v-model="searchdata.orderNo"
            maxlength="29"
            @clear="clickSearch()"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left:15px;">
          <el-button type="primary" @click="clickSearch()">查询</el-button>
          <el-button type="success" @click="clickRecharge()"
            >充值余额</el-button
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
        border
        max-height="600"
        height="600"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="orderNo"
          align="center"
          label="订单号"
          width="280"
          :resizable="false"
        />
        <el-table-column
          prop="userId"
          align="center"
          label="用户ID"
          width="100"
          :resizable="false"
        />
        <el-table-column
          prop="nickname"
          align="center"
          label="用户昵称"
          width="170px"
          :resizable="false"
        />
        <el-table-column
          prop="phone"
          align="center"
          label="绑定电话"
          width="120px"
          :resizable="false"
        />
        <el-table-column
          prop="orderTypeName"
          align="center"
          label="订单类型"
          width="100"
          :resizable="false"
        />
        <el-table-column
          :prop="lable.pro"
          align="center"
          :label="lable.labels"
          :resizable="false"
          show-overflow-tooltip
          v-for="(lable, index) in tablist"
          :key="index"
          width="110"
        />
        <el-table-column
          prop="payTimes"
          align="center"
          label="支付时间"
          width="180"
          :resizable="false"
        />
        <el-table-column
          prop="operatorUsers"
          align="center"
          label="操作人"
          :resizable="false"
        />
        <el-table-column
          prop="payTypes"
          align="center"
          label="充值渠道"
          width="150"
          :resizable="false"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payTypes }}</span>
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
        :page-sizes="[10, 20, 50, 100, 1000, 5000]"
        :page-size="searchdata.rows"
        prev-text="上一页"
        next-text="下一页"
        background
        layout="total,prev,pager,next,sizes,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 充值余额弹窗 -->

    <el-dialog
      title="充值余额"
      :visible.sync="rechardialog"
      width="40%"
      @close="recharClose"
      @closed="recharInit"
      :close-on-click-modal="false"
    >
      <div class="money_box">
        <el-form :model="paydata" ref="paydata" :inline="true" size="normal">
          <el-form-item
            prop="money"
            label="余额充值(元):"
            label-width="108px"
            :rules="[{ required: true, message: '请输入充值金额' }]"
          >
            <el-input
              size="mini"
              style="width: 200px;"
              placeholder="请输入金额"
              v-model="paydata.money"
              @input="changeMoney"
              ref="money"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              @clear="recharSearch()"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="rechar_box">
        <!-- 充值输入框 -->
        <div class="rechar_search">
          <el-form
            :model="recharSearchdata"
            ref="recharSearchdata"
            :inline="true"
            size="normal"
          >
            <el-form-item prop="userId" label="用户ID:" label-width="108px">
              <el-input
                size="mini"
                style="width: 200px;"
                placeholder="请输入用户ID"
                v-model="recharSearchdata.userId"
                maxlength="6"
                @input="changeSeIDre"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                @clear="recharSearch()"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="绑定手机号:">
              <el-input
                size="mini"
                style="width: 200px;"
                placeholder="请输入绑定手机号"
                v-model="recharSearchdata.phone"
                maxlength="11"
                @input="changeSePhre"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                @clear="recharSearch()"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="recharSearch()" size="mini"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 内部表格 -->
        <div class="rechar_table">
          <el-table
            :data="rechardata"
            ref="rechardata"
            v-loading="recharloading"
            element-loading-text="数据加载中"
            border
            max-height="300"
            height="300"
            :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
            @selection-change="rechSelectionChange"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column
              :prop="lable.pro"
              align="center"
              :label="lable.labels"
              :resizable="false"
              v-for="(lable, index) in recharlist"
              :key="index"
            />
          </el-table>
        </div>
        <div id="paging" style="margin-top: 30px">
          <el-pagination
            @size-change="recharSizeChange"
            @current-change="recharCurrentChange"
            :current-page="recharSearchdata.page"
            :page-sizes="[10, 20, 50, 100, 1000, 5000]"
            :page-size="recharSearchdata.rows"
            prev-text="上一页"
            next-text="下一页"
            small
            layout="total,prev,pager,next,sizes,jumper"
            :total="rechartotal"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer">
        <div class="btncenter">
          <el-button type="primary" @click="recharOK()" size="medium "
            >确定</el-button
          >
          <el-button @click="recharClose()" size="medium ">取消</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderList, recharges } from "@/api/finance/order";
// import { recharges } from "@/api/finance/orderpay";
import { getUserList } from "@/api/mzuser/user";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 11) {
        return value.slice(0, 11) + "...";
      }
      return value;
    }
  },
  data() {
    return {
      moneyfocus:false,
      filetext: "订单管理",
      filename: "订单管理", //导出的文件名
      multipleSelection: [], //勾选的
      tHeader: [
        "订单号",
        "用户ID",
        "用户昵称",
        "绑定电话",
        "订单类型",
        "金额(元)",
        "实际支付金额",
        "充值找币数",
        "充值星光数",
        "支付时间",
        "操作人",
        "充值渠道"
      ], //导出组件头部
      filterVal: [
        "orderNo",
        "userId",
        "nickname",
        "phone",
        "orderTypeName",
        "money",
        "realityMoney",
        "orderTypeone",
        "orderTypetwo",
        "payTimes",
        "operatorUsers",
        "payTypes"
      ], //导出组件头部对应值
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
      sear_PayDate: [],
      // 表单错误信息
      idError: null,
      phoneError: null,
      //判断弹窗操作类型 详情相关数据
      rechardialog: false,
      search_list_select: [
        {
          pro: "orderType",
          lab: "订单类型:",
          list: [
            { value: "", label: "全部" },
            { value: 0, label: "找币充值" },
            { value: 3, label: "星光充值" }
          ]
        },
        {
          // pro: "status",
          pro: "payType",
          lab: "支付方式:",
          list: [
            { value: "", label: "全部" },
            { value: 1, label: "安卓端充值" },
            { value: 2, label: "IOS端充值" },
            { value: 3, label: "后台充值" }
          ]
        }
      ],
      searchdata: {
        page: 1,
        rows: 10,
        userId: "", //用户ID
        phone: "", //绑定手机号
        orderNo: "", //订单号
        orderType: "", //订单类型
        // status: "",//支付方式
        payType:"",
        beginTime: "",
        endTime: ""
      },
      total: 0,
      rechartotal:0,
      tablist: [
        { pro: "money", labels: "金额(元)" },
        { pro: "realityMoney", labels: "实际支付金额" },
        { pro: "orderTypeone", labels: "充值找币数" },
        { pro: "orderTypetwo", labels: "充值星光数" }
      ],
      tableData: [],
      // 充值内部参数
      recharlist: [
        { pro: "userId", labels: "用户ID" },
        { pro: "phone", labels: "绑定手机号" },
        { pro: "nickname", labels: "用户昵称" }
      ],
      rechardata: [], //充值列表
      recharloading: true, //充值列表加载
      paydata: {
        money: "",
        userIds: []
      },
      // 充值获取所需参数
      recharSearchdata: {
        page: 1,
        rows: 20,
        userId: "", //用户ID
        phone: "" //绑定手机号
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    changeSeID() {
      let value = this.searchdata.userId;
      if (value.length == 1) {
        this.searchdata.userId = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.userId = value.replace(/\D/g, "");
      }
    },

    changeMoney() {
      let value = this.paydata.money;
      if (value.length == 1) {
        this.paydata.money = value.replace(/[^1-9]/g, "");
      } else {
        this.paydata.money = value.replace(/\D/g, "");
      }
    },
    changeSeIDre() {
      let value = this.recharSearchdata.userId;
      if (value.length == 1) {
        this.recharSearchdata.userId = value.replace(/[^0-9]/g, "");
      } else {
        this.recharSearchdata.userId = value.replace(/\D/g, "");
      }
    },
    changeSePhre() {
      let value = this.recharSearchdata.phone;
      if (value.length == 1) {
        this.recharSearchdata.phone = value.replace(/[^0-9]/g, "");
      } else {
        this.recharSearchdata.phone = value.replace(/\D/g, "");
      }
    },
    //搜索部分
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    blurphone() {
      let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phonereg.test(this.addform.phone)) {
        this.phoneError = "请输入正确的手机格式!";
      }
    },
    changetype(lab) {
      if (lab == "订单类型:") {
        switch (this.searchdata.orderType) {
          case 0:
            this.filename = "订单管理-找币充值";
            break;
          case 3:
            this.filename = "订单管理-星光充值";
            break;
          default:
            this.filename = "订单管理";
            break;
        }
      }
    },
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
    getuser() {
      getUserList(this.recharSearchdata).then(response => {
        if (response.code == "0") {
          this.rechardata = response.data.records;
          this.rechartotal=response.data.total
        }
      });
    },
    fetchData() {
      this.loading = true;
      orderList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.tableData = response.data.records.map(item => {
            item.payTimes = this.changedata(item.payTime);
            switch (item.payType) {

              case 0:
                item.payTypes = "安卓端微信支付";
                break;
              case 1:
                item.payTypes = "安卓端支付宝支付";
                break;
              case 2:
                item.payTypes = "苹果内购";
                break;
              case 3:
                item.payTypes = "后台充值";
                break;
              case null:
                item.payTypes = "未知";
                break;
              default:
                break;
            }
            //判断显示充值找币还是星光
            if (item.orderTypeName == "找币充值"||item.orderTypeName == "FUN充值") {
              item.orderTypeone = item.funcurrency;
              item.orderTypetwo = "---";
            } else if (item.orderTypeName == "星光充值") {
              item.orderTypeone = "---";
              item.orderTypetwo = item.funcurrency;
            }
            //操作人
            if (item.operatorUser == null) {
              item.operatorUsers = "---";
            } else {
              item.operatorUsers = item.operatorUser;
            }
            return item;
          });
          this.total = response.data.total;
        }
        this.loading = false;
      });
    },
    resetform() {
      this.$nextTick(() => {
        this.$refs.addform.resetFields(); //重置表单
        this.fetchData();
      });
    },
    //充值余额
    clickRecharge() {
      this.rechardialog = true;
      this.recharSearch();
    },
    // 取消余额充值
    recharClose() {
      this.rechardialog = false;
    },
    // 后台充值接口函数
    rechargesFun() {
      recharges(this.paydata).then(response => {
        if (response.code == "0") {
          this.Success("充值成功!");
          this.rechardialog = false;
        }
      }).catch(error=>{
        this.fetchData();
      });
    },
    // 确定充值
    recharOK() {
      this.$refs.paydata.validate(valid => {
        if (valid) {
          if (this.paydata.userIds.length < 1) {
            this.Warning("请选择用户!");
          } else {
            this.rechargesFun();
          this.moneyfocus=false;
          }
        } else {
          //不满足的时候 选中
          this.$refs.money.focus();
          return false;
        }
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
    // 初始化充值内容
    recharInit() {
      this.$refs.paydata.resetFields();
      this.$refs.recharSearchdata.resetFields();
      this.paydata.userIds = [];
     this.fetchData();
    },
    clickReset() {
      this.$refs.searchdata.resetFields(); //重置表单
      this.searchdata.page=1;
      this.searchdata.rows=10;
      this.fetchData();
    },
    rechSelectionChange(val) {
      this.paydata.userIds = val.map(item => {
        return item.userId;
      });
    },
    recharSizeChange(pageSize) {
      this.recharSearchdata.rows = pageSize;
      this.getuser();
    },
    recharCurrentChange(curPage) {
      this.recharSearchdata.page = curPage;
      this.getuser();
    },
    /*--------------------------------------------*/
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
    },
    // 余额充值及其内部操作
    // 获取列表参数
    recharSearch() {
      this.recharloading = false;
      this.getuser();
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
::v-deep .rechar_table .el-table td,
.el-table th {
  padding: 7px 0 !important;
}
.money_box .el-form,
.rechar_box .el-form {
  height: 50px;
}
::v-deep .money_box {
  .el-form-item__error {
    top: 87% !important;
  }
}
::v-deep .el-pagination--small .el-pagination__sizes{
margin-top: -3px;
transform: scale(90%);
}
</style>
