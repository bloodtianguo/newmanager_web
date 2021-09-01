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
        <el-form-item prop="anchorNickName" label="主播昵称:">
          <el-input
            placeholder="请输入主播昵称"
            v-model="searchdata.anchorNickName"
            maxlength="11"
            @clear="fetchData()"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="guildName" label="公会名称:">
          <el-input
            placeholder="请输入公会名称"
            v-model="searchdata.guildName"
            maxlength="11"
            style="width: 200px"
            @clear="fetchData()"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="anchorMzUserId" label="主播ID:">
          <el-input
            placeholder="请输入主播ID"
            v-model="searchdata.anchorMzUserId"
            maxlength="6"
            style="width: 200px"
            @clear="fetchData()"
             @input="changeSeID"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型:">
          <el-select
            v-model="searchdata.type"
            placeholder="请选择"
            clearable
            style="width: 150px"
            @clear="fetchData()"
          >
            <el-option
              v-for="item in AnchortypeLi"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="账号状态:">
          <el-select
            v-model="searchdata.status"
            placeholder="请选择"
            clearable
            style="width: 150px"
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
          <el-button type="primary " @click="fetchData()">查询</el-button>
          <el-button @click="clickReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
      <div class="tab_box">
        <el-table
          :data="tableData"
          ref="tableData"
          v-loading="loading"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          element-loading-text="数据加载中"
          max-height="600"
          height="600"
          border
          @selection-change="handleSelectionChange"
          @sort-change="clicksort"
        >
          <!-- :default-sort="{prop: 'fansTotalNum', order: 'descending'}" -->
          <el-table-column type="selection" width="40">
          </el-table-column>
          <el-table-column
            prop="anchorNickName"
            align="center"
            label="主播昵称"
            :resizable="false"
          >
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            width="100"
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
            width="120"
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
            width="80"
            align="center"
            :resizable="false"
            label="账号状态"
          >
           <template slot-scope="scope">
             <el-link v-if="scope.row.statu=='正常'" type="success" :underline="false">{{scope.row.statu}}</el-link>
             <el-link v-else type="danger" :underline="false">{{scope.row.statu}}</el-link>
          </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="100"
            align="center"
            :resizable="false"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="clickEdit(scope.row)"
                >主播详情</el-button
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
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total,prev,pager,next,sizes,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { anchorList } from '@/api/guild/guildmanage'
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
    return {
      filetext: "公会主播列表",
      filename: "公会主播列表",
      multipleSelection: [],//勾选的
      tHeader: ['主播昵称', '公会名称', '主播ID', '类型', '粉丝数量', '月涨粉数', '作品总数量', '月发布数', '总点赞数', '月点赞数', '总获取找票（未分账）', '月获取打赏找票(未分账)', '账号状态'],//导出组件头部
      filterVal: ['anchorNickName', 'guildName', 'anchorMzUserId', 'types', 'fansTotalNum', 'fansRiseNum', 'worksTotalNum', 'worksNum', 'likeTotalNum', 'likeNum', 'totalJBalance', 'jbalance', 'statu'],//导出组件头部对应值
      /*--------------勾选导出组件所需参数-------------*/
      list: null,
      loading: true,
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        anchorNickName: "",//主播昵称
        guildName: "",
        anchorMzUserId: "",//主播没找ID
        type: "",
        status: "",
        sort: "",//排序方式 0-降序 1-升序
        sortType: "",//排序类型 1-总粉丝数 2-作品总数 3-总点赞数 4-总获取打赏数
      },
      tablist: [
        { pro: "guildName", labels: "公会名称" },
        { pro: "anchorMzUserId", labels: "主播没找ID" },
        { pro: "types", labels: "类型" },
        { pro: "fansRiseNum", labels: "月涨粉数" },
        { pro: "worksNum", labels: "月发布数" },
        { pro: "likeNum", labels: "月点赞数" },
      ],
      tablistlast: [
        { pro: "fansTotalNum", labels: "粉丝数量" },//排序
        { pro: "worksTotalNum", labels: "作品总数量" },//排序
        { pro: "likeTotalNum", labels: "总点赞数" },//排序
      ],
      tableData: [],
      multipleSelection: [],//勾选的数组
      accStateLi: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '清退'
        }],
      //可根据后台请求
      AnchortypeLi: [
        {
          value: 1,
          label: '唱歌'
        },
        {
          value: 2,
          label: '跳舞'
        },
        {
          value: 3,
          label: '带货'
        },
        {
          value: 4,
          label: '情景'
        },
        {
          value: 5,
          label: '搞笑'
        },
        {
          value: 6,
          label: '美食'
        },
        {
          value: 7,
          label: '颜值'
        },
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
        changeSeID(){
      let value=this.searchdata.anchorMzUserId
        if(value.length ==1){
      this.searchdata.anchorMzUserId=value.replace(/[^0-9]/g,'')
      }else{
      this.searchdata.anchorMzUserId=value.replace(/\D/g,'')
      }
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection()
    },//重置勾选
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    fetchData() {
      this.loading = true
      anchorList(this.searchdata).then(response => {
        if (response.code == 0) {
          this.searchdata.sort = "";
          this.searchdata.sortType = "";
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
            item = this.switchtypeVal(item)
            return item
          })
          this.total = response.data.total
        }
        this.loading = false
      })
    },
    clickEdit(row) {
      this.$store.dispatch('guild/setGuildid', row.guildId)
      this.$store.dispatch('guild/setAnchorId', row.anchorId)
      sessionStorage.guildId=row.guildId
      sessionStorage.anchorId=row.anchorId
      this.$router.push('/Anchormanage/Anchordetails')
    },
    clickReset() {
      this.$refs.searchdata.resetFields()//重置表单
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 封装发送排序接口函数
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
.con_main {
  padding: 0 15px;
  .btn_box {
    margin-bottom: 20px;
  }
}
.width100 {
  width: 100px !important;
}

</style>
