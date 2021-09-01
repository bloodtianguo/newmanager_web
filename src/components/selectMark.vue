<!--name-->
<template>
  <div>
    <el-dialog
      title="视频标签"
      width="30%"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="cancleMark"
    >
      <section class="selectMark">
        <span>已选中标签：</span>
        <div class="seleBox">
          <div v-for="(v, i) in markNamelist" :key="i" class="seleContent">
            <span>{{ v }}</span>
            <span class="dele" @click="deleMark(i)">x</span>
          </div>
        </div>
      </section>
      <section class="sch">
        <span>搜索标签：</span>
        <el-input
          placeholder="请输入标签"
          v-model="searchdata.tag"
          maxlength="10"
          clearable
          style="width: 45%"
        >
        </el-input>
        <div>
          <el-button @click="searchList" type="primary">查询</el-button>
          <el-button @click="markReset" plain>重置</el-button>
        </div>
      </section>
      <div class="markBox">
        <div v-if="markList.length > 0 || showTag">
          <span
            v-if="showTag"
            v-for="(j, k) in windowMarkList"
            :key="k + 'k'"
            class="black"
            @click="currentMarkClick(j)"
            :class="{ activ: markNamelist.includes(j.tag) }"
            >{{ j.tag }}</span
          >
          <span
            v-for="(v, i) in markList"
            :key="i + 'i'"
            @click="currentMarkClick(v)"
            :class="{ activ: markNamelist.includes(v.tag) }"
            >{{ v.tag }}</span
          >
        </div>
        <p v-else class="noContent">暂无搜索内容</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$router.push('/mark')"
          >新建标签</el-button
        >
        <el-button plain @click="cancleMark">取 消</el-button>
        <el-button type="primary" @click="sureMarkClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api/mark'
export default {

  components: {},

  props: {
    videoID: {
      default: '',
      type: String,
    },
    tags: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      showTag: false,
      dialogFormVisible: false,
      searchdata: {
        page: 1,
        rows: 100000,
        tag: '',
      },
      markList: [], // 获取的标签数据
      markNamelist: [], // 获取的标签名称
      windowMarkList: [], // 记录最近六次的标签活动
    }
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      api.getEnableTagList(this.searchdata).then(res => {
        if (res.code == '0') {
          this.markList = res.data.records
          this.windowMarkList = JSON.parse(localStorage.getItem('windowMarkList')) || []
          if (this.windowMarkList.length > 0) { // 后端数据删除，本地数据对应删除
            let markArr = this.markList.map(v => {
              return v.id
            })
            this.windowMarkList = this.windowMarkList.filter(e => markArr.includes(e.id))
          }
          this.initSeleMark() // 初始化渲染选中标签
          this.searchdata.tag ? this.showTag = false : this.showTag = true
          if (!this.searchdata.tag) {
            this.markCommon() // 提取复用逻辑
          }
        }
      })
    },
    initSeleMark() {
      if (this.tags) {
        let tempArr = this.tags.split(',')
        this.markNamelist = []
        tempArr.forEach(v => {
          this.markNamelist.push(v)
        })
      }
    },
    deleMark(idx) {
      this.markNamelist.splice(idx, 1)
    },
    searchList() {
      this.initData()
    },
    markReset() {
      this.searchdata.tag = ''
      this.initData()
    },
    currentMarkClick(data) {
      let len = this.markNamelist.length
      for (let i = 0; i < len; i++) {
        if (this.markNamelist[i] == data.tag) {
          return
        }
      }
      if (len < 4) {
        this.markNamelist.push(data.tag)

        /* 记录最近活动的六个标签 */

        for (let i = 0, len = this.windowMarkList.length; i < len; i++) {
          if (this.windowMarkList[i].id == data.id) {
            return
          }
        }
        this.windowMarkList.push(data)
        if (this.windowMarkList.length > 6) { // 永远保留6个活动数据
          this.markList.unshift(this.windowMarkList[0]) // 删除的数据添加到列表数据里面
          this.windowMarkList.splice(0, 1)
        }
        this.markCommon() // 提取复用逻辑
        localStorage.setItem('windowMarkList', JSON.stringify(this.windowMarkList))
      } else {
        this.$message.warning('最多可选择4个标签')
      }
    },
    markCommon() {
      let arr = this.windowMarkList.map(v => {
        return v.id
      })
      this.markList = this.markList.filter(e => !arr.includes(e.id))
    },
    sureMarkClick() {
      if (this.markNamelist.length == 0) {
        this.$message.warning('最少选择一个标签')
        return
      }
      let json = {
        _uid: this._uid,
        tags: this.markNamelist.join(','),
        videoId: this.videoID
      }
      api.addTagsForVideo(json).then(res => {
        if (res.code == 0) {
          this.markNamelist = []
          this.cancleMark()
          this.$emit('suerClick')
        }
      })

    },
    cancleMark() {
      this.$parent.isShowMark = false
      this.dialogFormVisible = false
    }
  },
  created() {
    this.initData()
  },
  mounted() { },
  //生命周期-挂载之前
  beforeMount() { },
  //生命周期-挂载完成（可以访问DOM元素）
  mounted() { },
}
</script>
<style scoped lang='scss'>
.selectMark {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .seleBox {
    border: 1px solid #ccc;
    min-height: 50px;
    width: 80%;
    border-radius: 4px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .seleContent {
      margin: 5px 15px 5px 0;
      text-align: center;
      color: #fff;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #8080ff;
      border-radius: 20px;
      padding: 0 10px;
      .dele {
        display: inline-block;
        font-size: 18px;
        cursor: pointer;
        margin: -5px 0 0 5px;
      }
    }
  }
}
.sch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.black {
  background-color: #6db773 !important;
}
.activ {
  background-color: #ccc !important;
}
.markBox {
  max-height: 292px;
  overflow-y: auto;
  // 修改滚动条
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: #f8f8f8;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: #dddddd;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  margin-top: 30px;
  border: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  span {
    margin: 10px 10px 10px 10px;
    display: inline-block;
    padding: 5px 15px;
    background-color: #46a8e0;
    border-radius: 15px;
    cursor: pointer;
    color: #fff;
  }
  .noContent {
    padding: 10px 0;
    margin: 0 auto;
  }
}
</style>