<template>
  <div class="app-container">
    <el-row class="linkcard minhei400">
      <router-link
        :to="item.path"
        v-for="(item, index) in linkpath"
        :key="index"
      >
        <el-col class="linkcard_main" :span="12">
          <div class="linkcard_main_title">{{ item.title }}</div>
          <p class="linkcard_main_introduce">{{ item.introduce }}</p>
        </el-col>
      </router-link>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkpath: [
        { path: "/guildAnchor/home", title: "平台工作台", introduce: "平台工作台介绍" },
        { path: "/guildmanage/guildmanage", title: "工会管理", introduce: "工会管理介绍" },
        { path: "/Anchormanage/Anchormanage", title: "工会主播管理", introduce: "工会主播管理介绍" },
        { path: "/guild/guildSet", title: "工会结算管理", introduce: "工会结算管理介绍" },
        { path: "/anchor/anchorSet", title: "主播结算管理", introduce: "主播结算管理介绍" },
        { path: "/platformAnchor/stat", title: "数据统计", introduce: "平台主播数据统计介绍" },
        { path: "/platformAnchor/broadcastRoomManage", title: "直播间管理", introduce: "直播间管理介绍" },
        { path: "/platformAnchor/platformAnchorManage", title: "平台主播管理", introduce: "平台主播管理介绍" },
        { path: "/platformAnchor/anchorList", title: "主播信息列表", introduce: "主播信息列表介绍" },
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.linkcard {
  background-color: #fff !important;
  padding: 20px 20px 34px;
  .linkcard_main {
    padding: 15px 20px;
    border-right: 1px dashed #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: rgb(243, 243, 243);
    }
  }
  .linkcard_main:nth-child(2),
  .linkcard_main:first-child {
    border-bottom: 1px dashed #e6e6e6;
  }
}
</style>
