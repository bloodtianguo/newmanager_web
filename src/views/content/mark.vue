<template>
  <div class="app-container">
    <div class="export_title fonwei">标签管理</div>
    <div id="search_box">
      <el-form
        style="height: 55px"
        :model="searchdata"
        ref="searchdata"
        :inline="true"
        size="normal"
      >
        <el-form-item prop="tag" label="标签:">
          <el-input
            placeholder="请输入标签"
            v-model="searchdata.tag"
            maxlength="10"
            @clear="clickSearch()"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickSearch()">查询</el-button>
          <el-button type="primary" @click="off.dialogAdd = true"
            >添加标签</el-button
          >
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
        @sort-change="clicksort"
      >
        <el-table-column
          prop="tag"
          label="标签"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- <el-table-column label="是否展示" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="changeSwitch(scope.row)"
              v-model="scope.row.statusFlag"
              active-color="#ccc"
              inactive-color="#5FB878"
            >
            </el-switch>
          </template>
        </el-table-column> -->

        <el-table-column
          prop="usedNum"
          label="使用数量"
          sortable="custom"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="updateUser"
          label="操作人"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="updateTimes"
          label="最后操作时间"
          align="center"
          :resizable="false"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 操作 -->
        <!-- fixed="right" -->
        <el-table-column label="操作" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="clickdetail(scope.row)"
              >删除</el-button
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

    <!-- 添加标签 -->
    <el-dialog
      title="添加标签"
      width="30%"
      :visible.sync="off.dialogAdd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="dialogClose"
    >
      <el-form>
        <el-form-item label="标签名称" label-width="80px">
          <el-input
            v-model="form.name"
            maxlength="6"
            autocomplete="off"
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSurce">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/mark'
export default {
  components: {
  },
  data() {

    return {
      rules: {
        tag: [
          { required: true, message: '请输标签内容', trigger: 'blur' },
        ]
      },
      form: {
        name: ''
      },
      off: {
        dialogAdd: false,
      },
      loading: false,
      _uid: sessionStorage.userId,
      searchdata: {
        page: 1,
        rows: 10,
        tag: "",
      },
      total: 0,
      tableData: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData(type) {
      this.loading = true
      if (type) {
        delete this.searchdata.orderByUsedNum
      }
      api.getTagList(this.searchdata).then(res => {
        this.loading = false
        this.tableData = res.data.records.map(item => {
          item.updateTimes = this.changedata(item.updateTime)
          // item.statusFlag = item.status == 0 ? true : false
          return item
        })
        this.total = res.data.total
      })
    },
    clicksort(row) {
      switch (row.order) {
        case 'ascending':
          this.searchdata.orderByUsedNum = 1
          break
        case 'descending':
          this.searchdata.orderByUsedNum = 2
          break
        default:
          delete this.searchdata.orderByUsedNum
      };
      this.initData()
    },
    changeSwitch(row) {
      let json = {
        _uid: this._uid,
        id: row.id,
        status: row.status == 1 ? 0 : row.status == 0 ? 1 : ''
      }
      api.updateStatus(json).then(res => {
        if (res.code == '0') {
          this.initData()
        }
      })
    },
    clickdetail(row) {
      let json = {
        _uid: this._uid,
        id: row.id,
      }
      this.$confirm('请慎重删除标签', '删除标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        api.deleteTag(json).then(res => {
          if (res.code == '0') {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {

      });
    },
    clickSearch() {
      this.initData()
    },
    addclose() {
      this.adddialog = false
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize
      this.initData()
    },
    handleCurrentChange(curPage) {
      if (this.searchdata.page == curPage) {
        return
      }
      this.searchdata.page = curPage
      this.initData()
    },
    dialogClose() {
      this.off.dialogAdd = false
      this.form.name = ''
    },
    dialogSurce() {
      if (!this.form.name) {
        this.$message.warning('标签内容不能为空')
      } else {
        let reg = /^[\u4e00-\u9fa5_0-9]+$/
        if (!reg.test(this.form.name)) {
          this.$message.warning('标签内容格式错误')
          this.form.name = ''
          return
        }
        let json = {
          _uid: this._uid,
          tag: this.form.name
        }
        api.addTag(json).then(res => {
          if (res.code == '0') {
            this.initData('add')
            this.dialogClose()
          }
        })
      }
    }
  }
}
</script>
<style scoped>
/deep/.el-form-item__error {
  top: 92%;
  left: 20px;
}
</style>
<style lang="scss" scoped>
.export_title {
  font-size: 18px;
  line-height: 30px;
  padding-left: 8px;
  padding-bottom: 5px;
  border-bottom: 2px solid #e1e6eb;
  margin-bottom: 10px;
  position: relative;
  &::before {
    content: '';
    height: 30px;
    position: absolute;
    left: 0;
    border: 1px solid #70b3c3;
  }
}
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
