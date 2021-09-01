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
        { path: "/videoManage/recreation", title: "娱乐视频审核", introduce: '娱乐视频审核介绍' },
        { path: "/videoManage/city", title: "城市名片审核", introduce: '城市名片审核介绍' },
        { path: "/videoManage/card", title: "打卡视频审核", introduce: '打卡视频审核介绍' },
        { path: "/videoManage/lostAndFound", title: "拾金不昧审核", introduce: '拾金不昧审核介绍' },
        { path: "/topicAudit", title: "话题审核", introduce: '话题审核介绍' },
        // { path: "/inform", title: "举报审核", introduce: '举报审核介绍' },
      ]
    };
  },
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
