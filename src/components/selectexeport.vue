<template>
  <div class="export_main">
    <div class="export_title fonwei">{{filetext}}</div>
    <div class="export_btn">
      <el-button
      size="small"
      type="success"
      :loading="downloadLoading"
      @click="handleDownload()"
    >
      <svg-icon icon-class="export" />
      导出EXCEL</el-button
    >
    </div>
  </div>
</template>
<script>
/*
导出勾选
组件使用:
(1)放置组件   <selectexeport :filename="filename"
                       :multipleSelection="multipleSelection"
                       :tHeader="tHeader"
                       :filterVal="filterVal" />

(2)组件参数设置
filename: "公会主播列表",//导出的文件名
multipleSelection: [],//勾选的
tHeader: [],//导出组件头部
filterVal:[],//导出组件头部对应值

(3)重置勾选状态
    clearmultiple () {
      this.$refs.tableData.clearSelection()
    },
*/
export default {
  props: {
      filetext: {
      type: String,
      default: ""
    }, //上方标题的文字
    filename: {
      type: String,
      default: ""
    }, //导出文件的名字
    multipleSelection: {
      type: Array,
      default: []
    }, //父级勾选的数组
    tHeader: {
      type: Array,
      default: []
    }, //父级传递头部名字
    filterVal: {
      type: Array,
      default: []
    } //父级传递的头部对应的值
  },
  data() {
    return {
      downloadLoading: false
    };
  },
  methods: {
    updateValue(val) {
      this.multipleSelection = val;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/utils/Export2Excel").then(excel => {
          const filterVal = this.filterVal; //需要导出的
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: this.filename
          });
          this.$parent.clearmultiple(); //传递指令使勾选框清空 clearmultiple()为父级的方法
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
      }
    }
  },
  watch: {
    multipleSelection: {
      handler(newValue) {
        this.multipleSelection = newValue;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button--success {
  color: #333;
  background-color: #f0f2f5 !important;
  border-color: #d6dce2 !important;
}
.el-button--success:hover {
  background-color: #ebedf0 !important;
  border-color: #d6dce2 !important;
}
.el-button--success:focus {
  background-color: #ebedf0 !important;
  border-color: #d6dce2 !important;
}
.svg-icon {
  width: 1.5em !important;
  height: 1.5em !important;
}
.export_main{
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e1e6eb;
  margin-bottom: 10px;
  .export_title{
    font-size: 18px;
    line-height: 30px;
    padding-left: 8px;
    position: relative;
     &::before{
    content: "";
    height: 30px;
    position: absolute;
    left: 0;
    border: 1px solid #70b3c3;
  }
  }
}
</style>
