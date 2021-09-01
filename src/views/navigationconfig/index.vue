<template>
  <div class="app-container">
    <div id="search_box">
      <!-- searchBox.areaName -->

      <el-form
        :model="searchBox"
        ref="searchBox"
        :inline="true"
        size="normal"
      >
        <el-form-item label="区域名称:" prop="areaName">
          <el-input
            placeholder="请输入区域名称"
            v-model="searchBox.areaName"
            maxlength="11"
            @clear="clickSearch()"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select
            class="marginR15"
            v-model="searchBox.type"
            placeholder="请选择类型"
            clearable
            @clear="clickSearch()"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select
            class="marginR15"
            v-model="searchBox.status"
            placeholder="请选择状态"
            clearable
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

        <el-form-item label="时间:">
          <el-date-picker
            style="margin-left: 15px"
            v-model="sear_PayDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            @change="clickSearch()"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickSearch()">查询</el-button>
          <el-button @click="clickReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="con_main">
      <div class="btn_box">
        <el-button type="success" size="mini" @click="clickSearch()"
          >查询</el-button
        >
        <el-button type="primary" size="mini" @click="addCityEs()"
          >新增城市代言</el-button
        >
        <el-button type="warning" size="mini" @click="addseekEs()"
          >新增找人/物</el-button
        >
        <el-button
          type="danger"
          size="mini"
          :disabled="copylist.homeId == ''"
          @click="clickPull()"
          >发布</el-button
        >
      </div>
      <!-- 表格 -->
      <div class="tab_box">
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-text="数据加载中"
          max-height="600"
          height="600"
          border
          :resizable="false"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        >
          <el-table-column label="" width="35" :resizable="false">
            <template slot-scope="scope">
              <el-radio
                v-if="scope.row.status == 0"
                :label="scope.$index"
                v-model="radio"
                @click.native.stop.prevent="
                  selectRadio(scope.$index, $event, scope.row)
                "
                >{{ "" }}</el-radio
              >
            </template>
          </el-table-column>

          <el-table-column
            label="序号"
            width="80"
            align="center"
            :resizable="false"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            prop="types"
            align="center"
            label="类型"
            width="100"
            :resizable="false"
          >
          </el-table-column>

          <el-table-column
            prop="area"
            align="center"
            label="区域"
            width="325"
            :resizable="false"
          >
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
            prop="statu"
            align="center"
            label="状态"
            width="100"
            :resizable="false"
          >
          </el-table-column>

          <el-table-column
            prop="nickName"
            align="center"
            label="操作人"
            width="100"
            :resizable="false"
          >
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="170"
            fixed="right"
            align="center"
            :resizable="false"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.statu == '已发布'"
                size="mini"
                @click="clickCopy(scope.row)"
                >复制</el-button
              >
              <el-button
                type="success"
                v-if="
                  scope.row.statu == '已发布' || scope.row.statu == '已停用'
                "
                size="mini"
                @click="clickDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                type="warning"
                v-if="scope.row.statu == '待发布'"
                size="mini"
                @click="clickEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                v-if="scope.row.statu == '待发布'"
                size="mini"
                @click="clickDel(scope.row)"
                >删除</el-button
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
        :current-page="searchBox.page"
        :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="searchBox.rows"
        prev-text="上一页"
        next-text="下一页"
        layout="total,prev,pager,next,sizes,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 弹窗部分 -->
    <div>
      <transition name="el-fade-in">
        <div v-if="cityAddshow" class="dialog">
          <div slot="header" class="dialog_header" @click="CityshowClo">
            <i class="el-icon-error"></i>
          </div>
          <div class="dialog-body">
            <CityEndorsement />
          </div>
        </div>
      </transition>
      <transition name="el-fade-in">
        <div v-if="seekAddshow" class="dialog">
          <div slot="header" class="dialog_header" @click="SeekshowClo">
            <i class="el-icon-error"></i>
          </div>
          <div class="dialog-body">
            <SeekSomething />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import {
  getList,
  copyHomeBar,
  publish,
  deleteHome,
  verify
} from "@/api/navigationconfig";
import { getchtime2 } from "@/utils/tools/format-time"; //时间格式转换
import { Success, Infos, Warning } from "@/utils/tools/message.js";
import CityEndorsement from "@/views/navigationconfig/cityendorsement"; //新增城市代言
import SeekSomething from "@/views/navigationconfig/seeksomething"; //新增找人找物
export default {
  components: {
    CityEndorsement,
    SeekSomething
  },
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
      areaName: "",
      list: null,
      loading: true,
      cityAddshow: false, //添加城市代言弹窗
      seekAddshow: false, //找人找物
      sear_PayDate: [], //时间选择器时间
      homeId: "", //勾选的id
      radio: false,
      copylist: {
        homeId: "",
        type: ""
      },
      verifylist: {
        status: "",
        type: ""
      },
      verifyRes: "",
      // 勾选的列表ID数组
      pickerOptions: {},
      searchBox: {
        page: 1,
        rows: 20,
        areaName: "",
        name: "",
        area: "",
        status: "",
        startTime: "",
        endTime: ""
      },
      total: 0,
      tablist: [
        //{ pro: "area", labels: "区域" },
        { pro: "createTime", labels: "创建时间" },
        { pro: "publishTime", labels: "发布时间" },
        { pro: "stopTime", labels: "停用时间" }
      ],
      tableData: [],
      typeList: [
        {
          value: 0,
          label: "城市代言"
        },
        {
          value: 1,
          label: "找人找物"
        }
      ],
      accStateLi: [
        {
          value: 0,
          label: "待发布"
        },
        {
          value: 1,
          label: "已发布"
        },
        {
          value: 2,
          label: "已停用"
        }
      ]
    };
  },
  created() {
    this.fetchData();
    this.cityAddshow = this.$store.state.user.CityPopup;
    this.seekAddshow = this.$store.state.user.SeekPopup;
  },

  methods: {
    clickReset(){
      this.$refs.searchBox.resetFields(); //重置表单
      this.sear_PayDate="";
      this.searchBox.startTime = "";
      this.searchBox.endTime = "";
      this.searchBox.page=1;
      this.searchBox.rows=10;
      this.fetchData();
    },//重置
    // 设置表格样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    fetchData() {
      this.loading = true;
      getList(this.searchBox).then(response => {
        var data = response.data;
        if (response.code == 0) {
          this.total = data.total;
          this.tableData = data.records.map(item => {
            item.checked = false;
            if (item.createTime) {
              item.createTime = getchtime2(item.createTime);
            } else {
              item.createTime = "—";
            }
            if (!item.nickName) item.nickName = "—";
            // 发布时间
            if (item.publishTime) {
              item.publishTime = getchtime2(item.publishTime);
            } else {
              item.publishTime = "—";
            }
            // 停用时间
            if (item.stopTime) {
              item.stopTime = getchtime2(item.stopTime);
            } else {
              item.stopTime = "—";
            }
            //状态
            switch (item.status) {
              case 0:
                item.statu = "待发布";
                break;
              case 1:
                item.statu = "已发布";
                break;
              case 2:
                item.statu = "已停用";
                break;
              default:
                item.statu = "—";
                break;
            }
            // 类型
            switch (item.type) {
              case 0:
                item.types = "城市代言";
                break;
              case 1:
                item.types = "找人找物";
                break;
              default:
                item.types = "—";
                break;
            }
            return item;
          });
          // if(this.areaName){
          //   this.SearchareaName()
          // }
          this.loading = false;
        }
        this.loading = false;
      });
    },
    addCityEs() {
      this.verifylist.status = "0";
      this.verifylist.type = "0";
      verify(this.verifylist).then(response => {
        if (response.code == "0") {
          this.verifyRes = response.data;
          if (this.verifyRes) {
            this.$store.dispatch("user/setCityinfo", "增加");
            this.cityAddshow = true;
          } else {
            Warning("操作失败当前存在待发布的城市代言!");
          }
        }
      });
    },
    addseekEs() {
      this.verifylist.status = "0";
      this.verifylist.type = "1";
      verify(this.verifylist).then(response => {
        if (response.code == "0") {
          this.verifyRes = response.data;
          if (this.verifyRes) {
            this.$store.dispatch("user/setSeekinfo", "增加");
            this.seekAddshow = true;
          } else {
            Warning("操作失败当前存在待发布的找人找物!");
          }
        }
      });
    },
    // 校验接口
    clickPull() {
      publish(this.copylist).then(response => {
        if (response.code == "0") {
          Success("发布成功!");
          this.radio = false;
          this.fetchData();
        }
      });
    },
    /*---------------------列表操作---------------------*/
    clickEdit(row) {
      switch (row.type) {
        case 0:
          this.$store.dispatch("user/setCityinfo", "编辑");
          sessionStorage.homeId = row.id;
          this.cityAddshow = true;
          break;
        case 1:
          this.$store.dispatch("user/setSeekinfo", "编辑");
          sessionStorage.homeId = row.id;
          this.seekAddshow = true;
          break;
        default:
          break;
      }
    },
    clickCopy(row) {
      this.verifylist.status = "0";
      this.verifylist.type = JSON.parse(JSON.stringify(row.type));
      if (row.type == 0) {
        row.type = "0";
      }
      if (row.type == 1) {
        row.type = "1";
      }
      verify(this.verifylist).then(response => {
        if (response.code == "0") {
          if (response.data) {
            this.copylist.homeId = JSON.parse(JSON.stringify(row.id));
            copyHomeBar(this.copylist).then(response => {
              if (response.code == "0") {
                Success("复制成功!");
                this.radio = false;
                this.fetchData();
                this.copylist.homeId = "";
              }
            });
          } else {
            switch (row.type) {
              case "0":
                Warning("操作失败当前存在待发布的城市代言!");
                break;
              case "1":
                Warning("操作失败当前存在待发布的找人找物!");
                break;
              default:
                break;
            }
          }
        }
      });
    },
    clickDetail(row) {
      switch (row.type) {
        case 0:
          this.$store.dispatch("user/setCityinfo", "详情");
          sessionStorage.homeId = row.id;
          this.cityAddshow = true;
          break;
        case 1:
          this.$store.dispatch("user/setSeekinfo", "详情");
          sessionStorage.homeId = row.id;
          this.seekAddshow = true;
          break;
        default:
          break;
      }
    },
    clickDel(row) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 对接接口
          this.copylist.homeId = JSON.parse(JSON.stringify(row.id));
          deleteHome(this.copylist).then(response => {
            if (response.code == "0") {
              Success("删除成功!");
              this.radio = false;
              this.fetchData();
              this.copylist.homeId = "";
            }
          });
        })
        .catch(err => {
          console.log("取消", err);
          Infos("已取消删除");
        });
    },
    selectRadio(index, e, row) {
      if (index === this.radio) {
        this.radio = 100;
        this.copylist.homeId = "";
        this.copylist.type = "";
      } else {
        this.radio = index;
        this.copylist.homeId = JSON.parse(JSON.stringify(row.id));
        this.copylist.type = JSON.parse(JSON.stringify(row.type));
        if (row.type == 0) {
          this.verifylist.type = "0";
        } else {
          this.verifylist.type = "1";
        }
      }
    },
    /*----------城市代言--------*/
    CityshowClo() {
      this.fetchData();
      this.cityAddshow = false;
      sessionStorage.removeItem("homeId");
      this.$store.dispatch("user/setCityinfo", "关闭");
    },
    CityshowOk() {
      this.cityAddshow = false;
    },
    /*----------找人找物--------*/
    SeekshowClo() {
      this.fetchData();
      this.seekAddshow = false;
      sessionStorage.homeId = "";
      this.$store.dispatch("user/setSeekinfo", "关闭");
    },
    /*---------------------弹窗操作---------------------*/
    clickSearch() {
      if (this.sear_PayDate !== null) {
        this.searchBox.startTime = this.sear_PayDate[0];
        this.searchBox.endTime = this.sear_PayDate[1];
        this.fetchData();
      } else {
        this.searchBox.startTime = "";
        this.searchBox.endTime = "";
        this.fetchData();
      }
    },

    handleSizeChange(pageSize) {
      this.searchBox.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchBox.page = curPage;
      this.fetchData();
    }
  },
  computed: {
    getCityPopup() {
      return this.$store.state.user.CityPopup;
    },
    getSeekPopup() {
      return this.$store.state.user.CityPopup;
    }
  },
  watch: {
    getCityPopup() {
      this.cityAddshow = this.$store.state.user.CityPopup;
      this.$forceUpdate;
    },
    getSeekPopup() {
      this.seekAddshow = this.$store.state.user.SeekPopup;
      this.$forceUpdate;
    }
  }
};
</script>
<style lang="scss" scoped>
.marginR15 {
  margin-right: 15px !important;
}
#search_box {
  margin-bottom: 20px;
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
    .el-button--danger {
      background-color: #33ab9f;
      border-color: #33ab9f;
      &:hover {
        background-color: #55c0b5;
        border-color: #55c0b5;
      }
    }
  }
}
.dialog {
  position: absolute;
  background-color: #fff;
  top: 20px;
  left: 20px;
  padding-top: 30px;
  width: calc(100% - 45px);
  height: calc(100% - 40px);
  overflow: auto;
  z-index: 888;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%), 0 -1px 4px rgb(0 21 41 / 8%);
  .dialog_header {
    font-size: 40px;
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
    transform: all 0.5s;
    &:hover {
      color: #a74ed5;
    }
  }
}
</style>
