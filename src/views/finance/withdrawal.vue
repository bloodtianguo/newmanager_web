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
        <el-form-item prop="status" label="状态:">
          <el-select
            v-model="searchdata.status"
            placeholder="请选择"
            clearable
            style="width: 150px; marginleft: 10px"
            @clear="clickSearch()"
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
        <el-form-item prop="phone" label="绑定手机号:">
          <el-input
            style="width: 200px;"
            placeholder="请输入绑定手机号"
            v-model="searchdata.phone"
            maxlength="11"
            @input="changePhone"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            @clear="clickSearch()"
            clearable
          >
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
        max-height="620"
        height="620"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          width="80"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="userName"
          label="用户昵称"
          width="100"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="money"
          label="申请提现金额(元)"
          width="135"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="moneyWithdraw"
          label="用户收益金额(元)"
          width="155"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.moneyWithdraw }}</span>
            <span class="colred">(云:{{ scope.row.reckon }})</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fees"
          label="用户抽成占比(%)"
          width="135"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="jindou"
          label="兑换找票"
          width="90"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          :prop="lable.pro"
          align="center"
          :label="lable.labels"
          width="130"
          :resizable="false"
          v-for="(lable, index) in tablist"
          :key="index"
        />
         <el-table-column
          prop="applyTimes"
          label="申请时间"
          width="160"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checkerTimes"
          label="处理时间"
          width="160"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="statu"
          align="center"
          width="80"
          :resizable="false"
          label="账号状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==3||scope.row.status==1" class="fonclogre">{{ scope.row.statu }}</span>
            <span v-if="scope.row.status==4||scope.row.status==5" class="fonclored">{{ scope.row.statu }}</span>
            <span v-if="scope.row.status==0||scope.row.status==2" class="foncloblue">{{ scope.row.statu }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="systemRemark"
          label="系统备注"
          width="140"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="remark"
          label="拒绝原因备注"
          width="140"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="checker"
          label="操作人"
          width="90"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <el-table-column
          prop="operationStatu"
          label="云打款操作状态"
          width="130"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        />
        <!-- 操作 -->
        <el-table-column
          label="操作"
          width="250"
          :resizable="false"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">
              <el-button
                type="primary"
                size="mini"
                @click="clickEdit(scope.row, '系统云打款')"
                >云打款</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="clickEdit(scope.row, '人工打款')"
                >人工打款</el-button
              >
              <el-button type="danger" size="mini" @click="refuse(scope.row)"
                >拒绝</el-button
              >
            </div>
            <el-button
              v-if="scope.row.status == 3||scope.row.status == 1"
              type="primary"
              size="mini"
              @click="clickEdit(scope.row, '打款详情')"
              >打款详情</el-button
            >
            <el-button
              v-if="scope.row.status == 4 || scope.row.status == 5"
              type="primary"
              size="mini"
              @click="clickdetails(scope.row)"
              >详情</el-button
            >
            <el-button
              v-if="scope.row.status == 2 && scope.row.operationStatus !== 1"
              type="warning"
              size="mini"
              @click="cancelpay(scope.row)"
              >取消云打款</el-button
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
    <!--弹窗部分 打款详情-->
    <el-dialog
      :title="operationType"
      :visible.sync="popdialog"
      width="40%"
      @close="popupClose"
      @closed="operationType = ''"
      :close-on-click-modal="false"
    >
      <div class="popman">
        <table class="poptable" cellpadding="0" cellspacing="0">
          <tr>
            <td class="tit td_tit fonwei">凭证信息</td>
            <td>用户ID</td>
            <td>{{ voucherInfo.userId }}</td>
          </tr>
          <tr>
            <td class="td_tit"></td>
            <td>用户昵称</td>
            <td>{{ voucherInfo.userName }}</td>
          </tr>
          <tr>
            <td class="td_tit"></td>
            <td>支付宝账号</td>
            <td>{{ voucherInfo.cardAccount }}</td>
          </tr>
          <tr>
            <td class="td_tit"></td>
            <td>支付宝名称</td>
            <td>{{ voucherInfo.cardName }}</td>
          </tr>
          <tr>
            <td class="td_tit"></td>
            <td>联系电话</td>
            <td>{{ voucherInfo.contactPhone }}</td>
          </tr>
          <tr>
            <td class="td_tit"></td>
            <td>本次打款金额</td>
            <td>{{ voucherInfo.money }}元</td>
          </tr>
          <tr v-if="operationType == '打款详情'">
            <td class="td_tit"></td>
            <td>审核人员</td>
            <td>没找</td>
          </tr>
          <tr v-if="operationType == '打款详情'">
            <td class="td_tit fonwei">打款金额</td>
            <td colspan="5" class="fonred">{{ voucherInfo.money }}元</td>
          </tr>
          <tr v-else>
            <td class="td_tit fonwei">确认打款</td>
            <td colspan="5" class="fonred">{{ voucherInfo.money }}元</td>
          </tr>
          <tr v-if="operationType !== '打款详情'">
            <td class="td_tit fonred fon12">此时为{{ operationType }}!</td>
          </tr>
        </table>
      </div>
      <span slot="footer">
        <div class="btncenter">
          <el-button
            v-if="operationType !== '打款详情'"
            type="primary"
            @click="popupOK()"
            >确定</el-button
          >
          <el-button @click="popupClose()">取消</el-button>
        </div>
      </span>
    </el-dialog>
    <!--拒绝 打款失败 详情-->
    <el-dialog
      title="详情"
      :visible.sync="refusedialog"
      width="40%"
      @close="refusedialog = false"
      :close-on-click-modal="false"
    >
      <div class="hei320 refuse">
        <table class="poptable">
          <tr style="margin-bottom:15px" class="trhoverF">
            <td class="titmain fonwei">拒绝理由:</td>
            <td>{{ refuseInfo.reason }}{{refuseInfo.remark}}</td>
          </tr>
          <tr class="trhoverF">
            <td class="titmain fonwei">操作人员:</td>
            <td>{{ refuseInfo.checker }}</td>
          </tr>
        </table>
      </div>
      <span slot="footer">
        <div class="btncenter" style="width:100px">
          <el-button @click="refusedialog = false">取消</el-button>
        </div>
      </span>
    </el-dialog>
    <!--拒绝弹窗-->
    <el-dialog
      title="拒绝"
      :visible.sync="refuseshow"
      width="40%"
      @close="refuseshow = false"
      @closed="refuseinit"
      :close-on-click-modal="false"
    >
      <div class="hei320">
        <el-form label-width="120px" ref="refusedata" :model="refusedata">
          <el-form-item
            prop="reason"
            label="拒绝原因"
            :rules="[{ required: true, message: '请选择拒绝原因' }]"
          >
            <el-radio-group v-model="refusedata.reason">
              <div>
                <el-radio
                  v-model="refusedata.reason"
                  v-for="(item, index) in radioList"
                  :key="index"
                  :label="item.reason"
                ></el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="refusedata.remark"
              type="textarea"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <div class="btncenter">
          <el-button @click="refuseshow = false">取消</el-button>
          <el-button type="primary" @click="refuseok()">确定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  withdrawalList,
  systemPay,
  artificialPay,
  refusePay,
  cancelSystemPay
} from "@/api/finance/withdrawal";
import { switchtypeFin } from "@/utils/tools/switchfin";
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
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  data() {
    // 验证函数
    return {
      sear_PayDate: [], //搜索框中选择的时间
      filetext: "提现管理",
      filename: "提现管理", //导出的文件名
      multipleSelection: [], //勾选的
      tHeader: [
        "用户ID",
        "用户昵称",
        "申请提现金额(元)",
        "用户收益金额(元)",
        "用户抽成占比(%)",
        "兑换找票",
        "联系电话",
        "支付宝账号",
        "支付宝名称",
        "申请时间",
        "处理时间",
        "账号状态",
        "系统备注",
        "操作人",
        "云打款状态"
      ], //导出组件头部
      filterVal: [
        "userId",
        "userName",
        "money",
        "reall", //moneyWithdraw
        "fees",
        "jindou",
        "contactPhone",
        "cardAccount",
        "cardName",
        "applyTimes",
        "checkerTimes",
        "statu",
        "systemRemark",
        "checker",
        "statusName"
      ], //导出组件头部对应值
      /*--------------勾选导出组件所需参数-------------*/
      voucherInfo: {
        userId: "",
        userName: "",
        cardAccount: "",
        cardName: "",
        contactPhone: "",
        money: "",
        moneyWithdraw: ""
      },
      radioList: [
        { reason: "支付宝信息不正确" },
        { reason: "账号异常" },
        { reason: "暂不能提现" },
        { reason: "其他" }
      ],
      refusedata: {
        orderId: "", //订单ID
        reason: "支付宝信息不正确", //拒绝原因
        remark: "" //备注
      },
      refuseInfo: {
        remark: "",
        checker: ""
      },
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
      idError: null,
      phoneError: null,
      //判断弹窗操作类型 详情相关数据
      popdialog: false,
      refusedialog: false, //详情
      refuseshow: false, //拒绝弹窗
      operationType: "",
      popup: {},

      searchdata: {
        page: 1,
        rows: 10,
        status: "",
        userId: "",
        phone: "",
        beginTime: "",
        endTime: ""
      },
      total: 0,
      tablist: [
        { pro: "contactPhone", labels: "联系电话" },
        { pro: "cardAccount", labels: "支付宝账号" },
        { pro: "cardName", labels: "支付宝名称" }
      ],
      tableData: [],
      accStateLi: [
        { value: "", label: "全部" },
        { value: 0, label: "申请中" },
        { value: 1, label: "打款中" },
        { value: 2, label: "挂起" },
        { value: 3, label: "已打款" },
        { value: 4, label: "已拒绝" },
        { value: 5, label: "打款失败" }
      ],
      voucherdata: {
        orderId: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //搜索部分
    changeSeID() {
      let value = this.searchdata.userId;
      if (value.length == 1) {
        this.searchdata.userId = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.userId = value.replace(/\D/g, "");
      }
    },
    changePhone() {
      let value = this.searchdata.phone;
      if (value.length == 1) {
        this.searchdata.phone = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.phone = value.replace(/\D/g, "");
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
    blurphone() {
      let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phonereg.test(this.addform.phone)) {
        this.phoneError = "请输入正确的手机格式!";
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
    fetchData() {
      this.loading = true;
      // this.loading = false;
      withdrawalList(this.searchdata).then(response => {
        if (response.code == "0") {
          this.tableData = response.data.records.map(item => {
            if (item.fee) {
              item.fees = item.fee * 100;
            }
            if(item.applyTime){item.applyTimes = this.changedata(item.applyTime)}
            if(item.checkerTime){item.checkerTimes = this.changedata(item.checkerTime)}
            item.statu = switchtypeFin(item.status);
            if (!item.remark) {
              item.remark = "--";
            }
            item.reckon = Number(item.moneyWithdraw * 1.065).toFixed(2);
            item.reall=`${item.moneyWithdraw}(云:${item.reckon})`
            switch (item.operationStatus) {
              case 0:
                item.operationStatu = "未操作";
                break;
              case 1:
                item.operationStatu = "已打款";
                break;
              default:
                break;
            }
            return item;
          });
          this.total = response.data.total;
          this.$nextTick(() => {
            this.$refs.tableData.doLayout();
          });
        }

        this.loading = false;
      });
    },
    clickEdit(row, type) {
      this.operationType = type;
      this.voucherInfo = row;
      this.voucherdata.orderId = row.id;
      this.popdialog = true;
    },
    popupClose() {
      this.popdialog = false;
    },
    popupOK() {
      if (this.operationType == "系统云打款") {
        systemPay(this.voucherdata).then(response => {
          if (response.code == "0") {
            this.Success("操作成功!");
            this.popdialog = false;
            this.fetchData();
          }
        });
      } else if (this.operationType == "人工打款") {
        artificialPay(this.voucherdata).then(response => {
          if (response.code == "0") {
            this.Success("操作成功!");
            this.popdialog = false;
            this.fetchData();
          }
        });
      }
    },
    // 取消云打款
    cancelpay(row) {
      this.voucherdata.orderId = row.id;
      cancelSystemPay(this.voucherdata).then(response => {
        if (response.code == "0") {
          this.Success("取消云打款成功!");
          this.fetchData();
        }
      });
    },
    // 打开详情
    clickdetails(row) {
      this.refuseInfo = row;
      this.refusedialog = true;
    },
    //打开拒绝弹窗
    refuse(row) {
      this.refusedata.orderId = row.id;
      this.refuseshow = true;
    },
    refuseok() {
      this.$refs.refusedata.validate(valid => {
        if (valid) {
          refusePay(this.refusedata).then(response => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.fetchData();
              this.refuseshow = false;
            }
          });
        } else {
          return false;
        }
      });
      // 发送拒绝接口
    },
    // 窗口关闭(拒绝)初始化
    refuseinit(){
       this.$refs.refusedata.resetFields();
       this.refusedata.remark="";
    },
    //重置表单
    resetform() {
      this.$nextTick(() => {
        this.$refs.addform.resetFields();
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

.poptable {
  border-spacing: 0;
  border-collapse: collapse;
  tr {
    td {
      padding-left: 10px;
      width: 150px;
      line-height: 40px;
      text-align: left;
    }
    .tit {
      position: relative;
      &::after {
        content: "*";
        color: red;
      }
    }
  }
}
.refuse .poptable {
  tr {
    td {
      padding-left: 10px;
      width: 400px;
      line-height: 25px;
      text-align: left;
    }
    .titmain {
      width: 120px;
    }
  }
}
.el-dialog__body {
  padding: 20px !important;
}
::v-deep .el-radio {
  display: block;
  line-height: 34px;
  white-space: normal;
  margin-right: 0;
}
</style>
