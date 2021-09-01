<template>
  <div>
    <el-tabs type="border-card" @tab-click="changeTerminal">
      <el-tab-pane label="Android" id="1"></el-tab-pane>
      <el-tab-pane label="ios" id="2"></el-tab-pane>
      <div class="bt">
        <el-button type="primary" @click="add">+新增</el-button>
        <el-button type="success" @click="publish">发布</el-button>
      </div>
      <div class="ta">
        <el-table
          ref="tableref"
          :data="tableData"
          align="center"
          border
          style="width: 100%; height: 600px"
          :max-height="600"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="changePublishId"
          class="tablecla"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
            :resizable="false"
            :selectable="selectable"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="version"
            label="版本号"
            width="140"
            :resizable="false"
          >
            <span slot-scope="scope">{{ "V" + scope.row.version }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            prop="upgradeRule"
            label="升级规则"
            width="120"
            :resizable="false"
          >
            <template slot-scope="{ row: { upgradeRule } }">
              <span v-if="+upgradeRule === 0"
                ><span style="color: orange; font-size: 23px">●</span
                >稍后更新</span
              >
              <span v-else
                ><span style="color: red; font-size: 23px">●</span
                >强制更新</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="markWord"
            label="按钮提示语"
            width="180"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="publishStatus"
            label="发布状态"
            width="100"
            :resizable="false"
          >
            <template slot-scope="{ row: { publishStatus } }">
              <span v-if="+publishStatus === 0">未发布</span>
              <span v-else>已发布</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="remark"
            label="版本描述"
            :resizable="false"
          >
            <template slot-scope="scope">
              <div v-if="scope.$index === 0">
                <div v-html="scope.row.remark"></div>
              </div>
              <div v-else>
                <el-collapse
                  v-model="activeName"
                  accordion
                  @change="collapse()"
                >
                  <el-collapse-item align="center">
                    <template slot="title">
                      <div v-html="scope.row.cutRemark"></div>
                    </template>
                    <div v-html="scope.row.remark"></div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="间隔时长"
            width="100"
            :resizable="false"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.intervalTime !== null && scope.row.intervalTime > 0
                "
                >{{ scope.row.intervalTime + "h" }}</span
              >
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="次数"
            width="100"
            :resizable="false"
          >
            <span slot-scope="scope" v-if="scope.row.count > 0">{{
              scope.row.count
            }}</span>
            <span v-else>-</span>
          </el-table-column>
          <el-table-column
            align="center"
            prop="publishTime"
            :formatter="dateFormat"
            label="发布时间"
            width="180"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="createUserName"
            label="操作人"
            width="140"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="publishStatus"
            label="操作"
            width="140"
            :resizable="false"
          >
            <template slot-scope="scope">
              <span v-if="+scope.row.publishStatus === 0">
                <el-button type="primary" @click="update(scope.row)"
                  >编辑</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next,sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="rows"
          :current-page="currentPage"
          :total="pagination.total"
        >
        </el-pagination>
        <el-dialog
          :close-on-click-modal="false"
          title="增加/编辑版本"
          width="40%"
          :visible.sync="dialogFormVisible"
        >
          <el-form :model="form">
            <el-form-item :label-width="formLabelWidth">
              <template #label>
                <span>*版本号</span> <span style="color: #6ac0fb">V</span>
              </template>
              <el-input
                v-model="form.version"
                autocomplete="off"
                style="width: 100%"
                placeholder="按示例填写大于线上版本号"
              ></el-input>
            </el-form-item>
            <el-form-item label="*升级规则" :label-width="formLabelWidth">
              <el-radio v-model="form.upgradeRule" label="0">稍后更新</el-radio>
              <el-radio v-model="form.upgradeRule" label="1">强制更新</el-radio>
            </el-form-item>
            <el-form-item label="*按钮提示语" :label-width="formLabelWidth">
              <el-input
                v-model="form.markWord"
                style="width: 100%"
                placeholder="请输入按钮提示语"
                :disabled="'1' === form.upgradeRule"
              ></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth">
              <div class="intervalTime">
                <div class="ta">
                  <span>间隔时长</span>
                  <el-input-number
                    size="small"
                    v-model="form.intervalTime"
                    :min="0"
                    :precision="0"
                    :step="1"
                    :step-strictly="true"
                    :disabled="'1' === form.upgradeRule"
                  ></el-input-number>
                </div>
                <div>
                  <span>次数</span>
                  <el-input-number
                    size="small"
                    v-model="form.count"
                    :min="0"
                    :step="1"
                    :step-strictly="true"
                    :disabled="'1' === form.upgradeRule"
                  ></el-input-number>
                </div>
              </div>
            </el-form-item>
            <!--富文本-->
            <el-form-item label="*版本描述" :label-width="formLabelWidth">
              <quill-editor
                v-model="form.remark"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
              >
              </quill-editor>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import moment from "moment";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "appVersion",
  data() {
    return {
      tableData: [],
      firstId: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      terminal: 1,
      currentPage: 1,
      pagination: {},
      selectId: [],
      page: 1,
      rows: 10,
      numberFlag: false,
      form: {
        id: "",
        version: "",
        terminal: "",
        markWord: "",
        upgradeRule: "0",
        intervalTime: "",
        count: "",
        remark: "",
        cutRemark: ""
      },
      formLabelWidth: "100px",
      editorOption: {
        matchVisual: false,
        placeholder: "请输入版本描述"
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: '-""' }, { indent: '+""' }],
        [{ header: "2" }],
        ["clean"],
        [{ align: "center" }, { align: "justify" }, { align: "right" }]
      ], //富文本配置
      activeName: "0"
    };
  },
  methods: {
    collapse() {
      this.$nextTick(() => {
        this.$refs.tableref.doLayout(); // 解决表格错位
      });
    },
    stepchange() {
      console.log(this.form.intervalTime, "111");
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      if (date === null) {
        return "--";
      }
      var moment = require("moment");
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    publish() {
      if (this.selectId.length === 0) {
        this.$message({
          type: "warning",
          message: "请选中发布"
        });
        return;
      }
      this.$confirm("你确定要发布该版本么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.publishTo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布"
          });
        });
    },
    // replaceFun(val) {// 正则替换
    //   const delPc = /<p class="ql-align-center">/gm
    //   const delP = /<p>/gm
    //   const Brp = /<br>+?<\/p>/gm
    //   const elP = /<\/p>/gm
    //   val = val.replaceAll(delPc, "")
    //   val = val.replaceAll(delP, "")
    //   val = val.replaceAll(Brp, "<br>")
    //   val = val.replaceAll(elP, "<br>")
    //   return val
    // },
    save() {
      console.log("新增的", this.form);
      // this.form.remark = this.replaceFun(this.form.remark)
      const validFlag = this.paramValid();
      if (!validFlag) {
        return;
      }
      let sucess = "新增成功!";
      if (this.form.id) {
        sucess = "修改成功!";
      }
      this.form.terminal = this.terminal;
      this.req({
        url: "/version/editVersion",
        data: this.form,
        method: "POST"
      }).then(
        res => {
          this.$message({
            type: "success",
            message: sucess
          });
          this.getversionList();
          this.dialogFormVisible = false;
        },
        err => {
          console.log("err :", err); // 当业务逻辑发生错误时 进行处理
        }
      );
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getversionList();
    },
    handleSizeChange(e) {
      this.rows = e;
      this.getversionList();
    },
    changeTerminal(tab, event) {
      (this.terminal = tab.$attrs["id"]), this.getversionList();
    },
    getversionList() {
      this.req({
        url: `/version/versionList?terminal=${this.terminal}&page=${this.page}&rows=${this.rows}`,
        data: {},
        method: "GET"
      }).then(
        res => {
          this.tableData = res.data.records; // 数据渲染
          this.pagination = res.data;
          if (this.tableData.length > 0) {
            // 获取第一条信息
            this.firstId = this.tableData[0].id;
          }
          this.$nextTick(() => {
            this.$refs.tableref.doLayout(); // 解决表格错位
          });
        },
        err => {
          console.log("err :", err); // 当业务逻辑发生错误时 进行处理
        }
      );
    },
    selectable(row, index) {
      var publishStatus = row.publishStatus;
      if (publishStatus === 1) {
        return false;
      } else {
        return true;
      }
    },
    add() {
      if (
        this.tableData !== null &&
        this.tableData[0] !== undefined &&
        this.tableData[0].publishStatus === 0
      ) {
        this.$message({
          type: "warning",
          message: "已有未发布的版本信息,暂不能新增"
        });
        return;
      }
      this.dialogFormVisible = true;
      this.initFrom();
    },
    update(row) {
      this.$confirm("你真的要改变信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form = { ...row };
          this.form.upgradeRule = { ...row }.upgradeRule + "";
          this.dialogFormVisible = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消编辑"
          });
        });
    },
    publishTo() {
      if (this.selectId.length > 1) {
        this.$message({
          type: "warning",
          message: "只能发布一个"
        });
        return;
      }
      this.req({
        url: "/version/publishVersion?id=" + this.selectId[0].id,
        data: {},
        method: "GET"
      }).then(
        res => {
          this.$message({
            type: "success",
            message: "发布成功!"
          });
          this.getversionList();
        },
        err => {
          console.log("err :", err); // 当业务逻辑发生错误时 进行处理
        }
      );
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    changePublishId(val) {
      this.selectId = val;
    },
    paramValid() {
      //参数校验
      const reg = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
      if (!reg.test(this.form.version)) {
        this.$message({
          type: "warning",
          message: "版本号格式错误请填写如格式:xxx.xxx.xxx,每位可输入1到3位数字"
        });
        return false;
      }
      if (
        this.form.upgradeRule === "0" &&
        (this.form.markWord === null || this.form.markWord === "")
      ) {
        this.$message({
          type: "warning",
          message: "按钮提示语不能为空"
        });
        return false;
      }
      if (this.form.upgradeRule === "0" && this.form.markWord.length > 10) {
        this.$message({
          type: "warning",
          message: "按钮提示语长度不能超过10"
        });
        return false;
      }
      if (this.form.remark === null || this.form.remark === "") {
        this.$message({
          type: "warning",
          message: "版本描述不能为空"
        });
        return false;
      }
      if (
        this.form.upgradeRule === "0" &&
        (this.form.intervalTime === "" || this.form.intervalTime === 0)
      ) {
        this.$message({
          type: "warning",
          message: "间隔时长不能为空或0"
        });
        return false;
      }
      if (
        this.form.upgradeRule === "0" &&
        (this.form.count === "" || this.form.count === 0)
      ) {
        this.$message({
          type: "warning",
          message: "次数不能为空或0"
        });
        return false;
      }
      return true;
    },
    initFrom() {
      (this.form.id = ""),
        (this.form.version = ""),
        (this.form.terminal = ""),
        (this.form.markWord = ""),
        (this.form.upgradeRule = "0"),
        (this.form.intervalTime = 0),
        (this.form.count = 0),
        (this.form.remark = "");
    },
    showDown(val) {
      $("#" + val).hide();
    }
  },
  mounted: function() {
    this.getversionList();
  }
};
</script>
<style lang="scss" scoped>
.bt {
  padding: 20px 0 20px 20px;
}

.ta {
  padding: 0 20px 20px 20px;
}

.intervalTime {
  display: flex;
}
.el-table {
  overflow: auto;
}
.el-table__header-wrapper,
.el-table__body-wrapper,
.el-table__footer-wrapper {
  overflow: visible;
}
.el-table__body-wrapper {
  overflow-x: visible !important;
}
.el-table::after {
  position: relative;
}
.tablecla {
  ::v-deep .el-table__fixed-left {
    height: 100% !important;
  }

  ::v-deep .el-table__fixed {
    height: 100% !important;
  }
  ::v-deep .el-table_1_column_1 .el-table-column--selection .el-table__fixed {
    height: 100% !important;
  }
}
</style>
