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
        style="height:55px"
        :model="searchdata"
        ref="searchdata"
        :inline="true"
        size="normal"
      >
        <el-form-item prop="guildName" label="公会名称:">
          <el-input
            placeholder="请输入公会名称"
            v-model="searchdata.guildName"
            maxlength="10"
            @clear="clickSearch()"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="guildMzUserId" label="会长ID:">
          <el-input
            placeholder="请输入会长ID"
            v-model="searchdata.guildMzUserId"
            maxlength="6"
            @clear="clickSearch()"
            clearable
            style="width: 200px"
            @input="changeSeID"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          >
            >
          </el-input>
        </el-form-item>
        <el-form-item prop="status" label="账号状态:">
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
        <el-form-item>
          <el-button type="primary" @click="clickSearch()">查询</el-button>
          <el-button @click="clickReset()">重置</el-button>
        </el-form-item>
      </el-form>
     <div class="btn_box">
        <el-button type="primary" @click="clickadd()">添加公会</el-button>
      </div>
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
          @sort-change="clicksort"
        >
          <!-- :row-class-name="tableRowClassName" -->
          <el-table-column type="selection" width="40"> </el-table-column>
          <!-- fixed="left" -->
          <el-table-column
            prop="guildName"
            label="公会名称"
            width="180"
            align="center"
            :resizable="false"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :label="lable.labels"
            width="95"
            :resizable="false"
            v-for="(lable, index) in tablist"
            :key="index"
          >
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            sortable="custom"
            width="130"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablistlast"
            :key="lable.pro"
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
            prop="jbalance"
            align="center"
            :resizable="false"
            label="月获取打赏找票(未分账)"
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
                >公会详情</el-button
              >
              <el-button
                size="mini"
                v-show="scope.row.status == 0"
                type="info"
                @click="clickdetail(scope.row)"
                >清退</el-button
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
    <el-dialog
      title="添加公会"
      :visible.sync="adddialog"
      width="40%"
      @close="addclose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :hide-required-asterisk="true"
          ref="addform"
          :model="addform"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item label="会长ID" prop="mzUserId" :error="idError">
            <el-input
              placeholder="请输入ID"
              v-model="addform.mzUserId"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              @input="changeID"
              maxlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="绑定手机号" prop="phone" :error="phoneError">
            <el-input
              placeholder="请输入手机号码"
              v-model.number="addform.phone"
              maxlength="11"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              @input="changePhone"
              @blur="blurphone()"
            ></el-input>
          </el-form-item>
          <el-form-item label="公会名称" prop="guildName">
            <el-input
              placeholder="请输入公会名称"
              v-model="addform.guildName"
              minlength="2"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="平台分成" prop="proportion">
            <span class="slots--left">25%≤</span>
            <el-input
              v-model.number="addform.proportion"
              placeholder="请输入平台分成"
              maxlength="2"
              @input="changeProp"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              style="width: 170px"
              ><i slot="suffix" style="font-style: normal; margin-right: 10px"
                >%</i
              ></el-input
            >
            <span class="slots--right">≤50%</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="addclose()">取消</el-button>
        <el-button type="primary" @click="addOK('addform')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { guildList, guildAdd, guildClear } from '@/api/guild/guildmanage'
export default {
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
      filetext: "公会列表",
      filename: "公会列表",//导出的文件名
      // downloadLoading: false,
      multipleSelection: [],//勾选的
      tHeader: ['公会名称', '会长ID', '旗下主播数', '月涨粉数', '月发布数', '月点赞数', '旗下粉丝总数', '作品总数量', '总点赞数', '总获取打赏找票(未分账)', '月获取打赏找票(未分账)', '账号状态'],//导出组件头部
      filterVal: ['guildName', 'guildMzUserId', 'totalAnchor', 'fansRiseNum', 'worksNum', 'likeNum', 'fansTotalNum', 'worksTotalNum', 'likeTotalNum', 'totalJBalance', 'jbalance', 'statu'],//导出组件头部对应值
      /*--------------勾选导出组件所需参数-------------*/
      // 验证
      rules: {
        mzUserId: [{ validator: validauid, trrigger: "blur" }],
        phone: [
          { required: true, message: "请填写手机号!", trigger: "blur" },
          // { pattern: /^1[3-9](\d{9})$/, message: '请输入正确格式的手机号', trigger: ['change','blur'] },
          { validator: validaphone, trrigger: ['change', 'blur'] }
        ],
        guildName: [
          { required: true, message: "请输入公会名称!", trigger: "blur" },
          { min: 2, max: 10, message: "长度限制在2-10字符!", trigger: "blur" }
        ],
        proportion: [{ validator: validaratio, trrigger: "blur" }]
      }
      ,
      list: null,
      loading: true,
      adddialog: false,
      // 表单错误信息
      idError: null,
      phoneError: null,
      searchdata: {
        page: 1,
        rows: 20,
        guildName: "",
        guildMzUserId: "",
        status: "",
        sort: "",//num 排序方式 0-降序 1-升序
        sortType: "",//num 排序类型 1-总粉丝数 2-作品总数 3-总点赞数 4-总获取打赏数
      },
      // 添加公会
      addform: {
        _uid: sessionStorage.userId,
        mzUserId: "",
        phone: "",
        guildName: "",
        proportion: "",
      },
      total: 0,
      tablist: [
        { pro: "guildMzUserId", labels: "会长ID" },
        { pro: "totalAnchor", labels: "旗下主播数" },
        { pro: "fansRiseNum", labels: "月涨粉数" },
        { pro: "worksNum", labels: "月发布数" },
        { pro: "likeNum", labels: "月点赞数" },
      ],
      tablistlast: [
        { pro: "fansTotalNum", labels: "旗下粉丝总数" },//排序
        { pro: "worksTotalNum", labels: "作品总数" },//排序
        { pro: "likeTotalNum", labels: "总点赞数" },//排序
      ],
      tableData: [],
      accStateLi: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '清退'
        }],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //搜索部分
    changeSeID() {
      let value = this.searchdata.guildMzUserId
      if (value.length == 1) {
        this.searchdata.guildMzUserId = value.replace(/[^0-9]/g, '')
      } else {
        this.searchdata.guildMzUserId = value.replace(/\D/g, '')
      }
    },
    //添加部分
    changeID() {
      let value = this.addform.mzUserId
      if (value.length == 1) {
        this.addform.mzUserId = value.replace(/[^0-9]/g, '')
      } else {
        this.addform.mzUserId = value.replace(/\D/g, '')
      }
    },
    changePhone() {
      let value = this.addform.phone
      if (value.length == 1) {
        this.addform.phone = value.replace(/[^0-9]/g, '')
      } else {
        this.addform.phone = value.replace(/\D/g, '')
      }
    },
    changeProp() {
      let value = this.addform.proportion
      if (value.length == 1) {
        this.addform.proportion = value.replace(/[^0-9]/g, '')
      } else {
        this.addform.proportion = value.replace(/\D/g, '')
      }
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection()
    },//重置勾选状态
    blurphone() {
      let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!phonereg.test(this.addform.phone)) {
        this.phoneError = "请输入正确的手机格式!"
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    tableHeaderClass() {
      return 'tableHeader';
    },
    fetchData() {
      this.loading = true
      guildList(this.searchdata).then(response => {
        if (response.code == 0) {
          this.searchdata.sort = "";
          this.searchdata.sortType = "";
          this.total = response.data.total
          this.tableData = response.data.records.map(item => {
            switch (item.status) {
              case 0:
                item.statu = "正常"
                break;
              case 1:
                item.statu = "清退"
                break;
              default:
                break;
            }
            if (item.jbalance == "") {
              item.jbalance == "--"
            }
            return item
          })
        }
        this.$nextTick(() => {
          this.$refs.tableData.doLayout();
        });
        this.loading = false
      })
    },
    clickEdit(row) {
      this.$store.dispatch('guild/setGuildid', row.guildId)
      sessionStorage.guildId=row.guildId
      this.$router.push('/guildmanage/guilddetails')
    },
    resetform() {
      this.$nextTick(() => {
        this.$refs.addform.resetFields()//重置表单
        this.fetchData()
      })
    },
    clickdetail(row) {
      this.$confirm('清退公会，将解除平台和公会的关系！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清退接口
        guildClear(row).then(response => {
          if (response.code == 0) {
            this.fetchData()
            this.Success("清退成功")
          }
        })
        // 成功后重新渲染页面
      }).catch(() => {
        this.Infos("取消清退")
      });
    },
    clickSearch() {
      // bug
      this.fetchData()
    },
    clickReset() {
      this.$refs.searchdata.resetFields()//重置表单
      this.fetchData()
    },
    clickadd() {
      this.adddialog = true
      this.resetform()//重置表单
    },
    addclose() {
      this.adddialog = false
    },
    addOK() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          // 接添加接口
          guildAdd(this.addform).then(response => {
            if (response.code == 0) {
              this.Success("添加公会成功")
              this.adddialog = false
              this.fetchData()
            } else {
              if (response.msg.includes("ID")) {
                this.idError = response.msg
              } else if (response.msg.includes("号码" || "APP")) {
                this.phoneError = response.msg
              }
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sortFuntion(order) {
      if (order == "ascending") {
        this.searchdata.sort = 0
      } else if (order == "descending") {
        this.searchdata.sort = 1
      } else {
        this.searchdata.sort = ""
      }
    },

    clicksort(column) {
      this.sortFuntion(column.order)
      switch (column.prop) {
        case "fansTotalNum"://发送粉丝数量排序接口
          this.searchdata.sortType = 1;
          break;
        case "worksTotalNum"://发送作品总数量排序接口
          this.searchdata.sortType = 2;
          break;
        case "likeTotalNum"://发送总点赞数排序接口
          this.searchdata.sortType = 3;
          break;
        case "totalJBalance"://发送总获取打赏找票(未分账)排序接口
          this.searchdata.sortType = 4;
          break;
        default:
          break;
      }
      this.fetchData()
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
.btn_box {
    margin-bottom: 14px;
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
